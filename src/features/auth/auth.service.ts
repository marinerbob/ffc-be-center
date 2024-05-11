import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common'
import { $Enums as Enums } from '@prisma/client'

import { UsersService } from '../users/users.service'

import { PasswordService } from './password/password.service'
import { SessionsService } from './sessions/sessions.service'
import { AuthLoginPayloadDto } from './dto/auth-login-payload.dto'
import { RefreshSessionEntity } from './entities/refresh-session.entity'
import { AuthRegisterPayloadDto } from './dto/auth-register-payload.dto'
import { AuthRefreshPayloadDto } from './dto/auth-refresh-payload.dto'
import { generateCodeForVerification } from './auth.utils'
import { AuthVerifyPayloadDto } from './dto/auth-verify-payload.dto'

import { MailerService } from '~/common/modules/mailer/mailer.service'


@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly userService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly mailerService: MailerService,
    ) {}

    async login(loginPayloadDto: AuthLoginPayloadDto): Promise<{ accessToken: string, refreshSession: RefreshSessionEntity}> {
      try {
        const user = await this.userService.getUserByEmail(loginPayloadDto.email)

        if (!user) throw new UnauthorizedException()
        
        const isPasswordSame = await this.passwordService.checkPassword(loginPayloadDto.password, user.passwordHash)

        if (!isPasswordSame) throw new UnauthorizedException()

        const refreshSession = await this.sessionsService.generateNewRefreshSession({
          userId: user.id,
          userAgent: loginPayloadDto.userAgent,
          ip: loginPayloadDto.ip,
          fingerprint: loginPayloadDto.fingerprint,
        })

        await this.sessionsService.addNewRefreshSession(refreshSession)

        const accessToken = await this.sessionsService.generateAccessToken(user)

        return {
          refreshSession,
          accessToken,
        }
      } catch (error) {
        // log exception
        throw error
      }
    }
  
    async logout(refreshToken: string): Promise<void> {
      await this.sessionsService.removeSessionByToken(refreshToken)
    }

    async logoutAllSessions(): Promise<void> {
      // TODO: parse userEmail from token, get user and delete by id
    }

    async register(registerPayloadDto: AuthRegisterPayloadDto): Promise<{ accessToken: string, refreshSession: RefreshSessionEntity}> {
      try {
        const existingUser = await this.userService.getUserByEmail(registerPayloadDto.email)

        if (existingUser) throw new NotAcceptableException()

        const passwordHash = await this.passwordService.generatePasswordForUser(registerPayloadDto.password)
        
        const user = await this.userService.create({
          email: registerPayloadDto.email,
          passwordHash,
          role: Enums.Role.USER,
        })

        const refreshSession = await this.sessionsService.generateNewRefreshSession({
          userId: user.id,
          userAgent: registerPayloadDto.userAgent,
          ip: registerPayloadDto.ip,
          fingerprint: registerPayloadDto.fingerprint,
        })

        await this.sessionsService.addNewRefreshSession(refreshSession)

        const accessToken = await this.sessionsService.generateAccessToken(user)

        await this.sendRegisterMail(user.email)

        return {
          refreshSession,
          accessToken,
        }
      } catch (error) {
        // log exception
        throw error
      }
    }

    async refresh(refreshPayloadDto: AuthRefreshPayloadDto): Promise<{ accessToken: string, refreshSession: RefreshSessionEntity }> {
      try {
        if (!refreshPayloadDto.refreshToken) throw new UnauthorizedException()

        const oldSession = await this.sessionsService.getRefreshSessionByToken(refreshPayloadDto.refreshToken)
        const isSessionInvalid = this.sessionsService.isRefreshSessionInvalid(oldSession, refreshPayloadDto.fingerprint)

        if (isSessionInvalid) throw new Error('Session is invalid')

        await this.sessionsService.removeSessionByToken(oldSession.refreshToken)

        const user = await this.userService.getUserById(oldSession.userId)

        const newSession = await this.sessionsService.generateNewRefreshSession({
          userId: user.id,
          userAgent: refreshPayloadDto.userAgent,
          ip: refreshPayloadDto.ip,
          fingerprint: refreshPayloadDto.fingerprint,
        })

        await this.sessionsService.addNewRefreshSession(newSession)

        const accessToken = await this.sessionsService.generateAccessToken(user)

        return {
          refreshSession: newSession,
          accessToken,
        }
      } catch (error) {
        // log exception
        throw error
      }
    }

    // TODO: после интеграции redis - выносить это туда, сейчас моковый метод
    async sendRegisterMail(email: string): Promise<void> {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Благодарим за регистрацию',
        html: `Ваш код верификации аккаунта: <b>${generateCodeForVerification()}</b>`,
      })
    }

    // TODO: после интеграции redis - выносить это туда, сейчас моковый метод c проверкой просто по наличию кода
    async verifyUser(verifyPayload: AuthVerifyPayloadDto): Promise<void> {
      const session = await this.sessionsService.getRefreshSessionByToken(verifyPayload.refreshToken)
      const userId = session.userId

      // TODO: проверка кода из редиса, по userId
      this.userService.update(userId, {
        isVerified: Boolean(verifyPayload.verificationCode),
      })
    }
}
