import ms, { StringValue } from 'ms'
// eslint-disable-next-line import/named
import { v4 }  from 'uuid'
import { validate } from 'class-validator'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'

import { JwtService } from '../jwt/jwt.service'
import { RefreshSessionEntity } from '../entities/refresh-session.entity'
import { UserSessionPayloadDto } from '../dto/user-session-payload.dto'

import { PrismaService } from '~/common/modules/prisma/prisma.service'

@Injectable()
export class SessionsService {
  private refreshExpiresIn: string
  private accessExpiresIn: string

  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    ) {
      this.refreshExpiresIn = this.configService.get('REFRESH_TOKEN_EXPIRES_IN')
      this.accessExpiresIn = this.configService.get('ACCESS_TOKEN_EXPIRES_IN')
    }

  async generateNewRefreshSession(sessionData: UserSessionPayloadDto): Promise<RefreshSessionEntity> {
    const expiresInMs = new Date().getTime() + ms(this.refreshExpiresIn as StringValue)
    const expiresInForSession = Math.floor(expiresInMs / 1000)

    try {
      const newSession = new RefreshSessionEntity()

      newSession.refreshToken = v4()
      newSession.userId = sessionData.userId
      newSession.expiresIn = expiresInForSession
      newSession.fingerprint = sessionData.fingerprint
      newSession.ip = sessionData.ip
      newSession.userAgent = sessionData.userAgent

      const errors = await validate(newSession)

      if (errors.length > 0) {
        throw new BadRequestException(errors)
      }
      
      return newSession
    } catch (error) {
      // logging
      throw error
    }
  }

  async addNewRefreshSession(sessionData: RefreshSessionEntity): Promise<void> {
    try {
      await this.prismaService.authSession.create({
        data: {
          id: sessionData.refreshToken,
          userId: sessionData.userId,
          userAgent: sessionData.userAgent,
          ip: sessionData.ip,
          fingerprint: sessionData.fingerprint,
          expiresIn: sessionData.expiresIn,
        },
      })
    } catch (error) {
      // logging
      throw new Error('error to add session in DB')
    }
  }

  // TODO: переделать после переноса в redis
  async isRefreshSessionInvalid(oldRefreshSession: RefreshSessionEntity, newFingerprint: string): Promise<boolean> {
    return new Date().getTime() > oldRefreshSession.expiresIn || oldRefreshSession.fingerprint !== newFingerprint
  }

  async generateAccessToken(user: User): Promise<string> {
    return await this.jwtService.signUser(user, this.accessExpiresIn)
  }

  async getRefreshSessionByToken(refreshToken: string): Promise<RefreshSessionEntity> {
    try {
      const sessionFromDB = await this.prismaService.authSession.findFirst({
        where: { id: refreshToken },
      })

      if (!sessionFromDB) throw new NotFoundException()

      const result = new RefreshSessionEntity()

      result.userId = sessionFromDB.userId
      result.expiresIn = Number(sessionFromDB.expiresIn)
      result.ip = sessionFromDB.ip
      result.fingerprint = sessionFromDB.fingerprint
      result.userAgent = sessionFromDB.userAgent
      result.refreshToken = sessionFromDB.id

      return result
    } catch (error) {
      // logging
      throw new NotFoundException()
    }
  }

  async removeSessionByToken(token: string): Promise<boolean> {
    const deletedResult = await this.prismaService.authSession.delete({
      where: { id: token },
    })

    return Boolean(deletedResult)
  }

  async removeAllSessions(userId: User['id']): Promise<boolean> {
    const deletedSessions = await this.prismaService.authSession.deleteMany({
      where: { userId },
    })

    return Boolean(deletedSessions.count)
  }
}
