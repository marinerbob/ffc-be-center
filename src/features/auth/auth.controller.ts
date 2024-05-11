import { Body, Post, Controller, Headers, Ip, Res, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response, Request } from 'express'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { RefreshDto } from './dto/refresh.dto'
import { VerifyDto } from './dto/verify.dto'
import { AuthGuard } from './auth.guard'

@ApiTags('API аутентификации')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Ручка логина, ответ предусматривает запись refreshToken в cookie' })
  @Post('login')
  async login(
    @Headers() headers,
    @Ip() ip,
    @Body() loginUserDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    ) {
    const loginPayload = await this.authService.login({
      ...loginUserDto,
      userAgent: headers['user-agent'],
      ip: ip,
    })

    // TODO: переместить в отдельный сервис по работе с cookie (вместе с инициализацией)
    res.cookie('refreshToken', loginPayload.refreshSession.refreshToken, {
      path: '/api/auth',
      maxAge: loginPayload.refreshSession.expiresIn,
      secure: true,
      httpOnly: true,
    })

    return {
      accessToken: loginPayload.accessToken,
      refreshToken: loginPayload.refreshSession.refreshToken,
    }
  }

  @ApiOperation({ summary: 'Ручка регистрации, ответ предусматривает создание новой сессии и запись refreshToken в cookie' })
  @Post('register')
  async register(
    @Headers() headers,
    @Ip() ip,
    @Body() registerUserDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const registerPayload = await this.authService.register({
      ...registerUserDto,
      userAgent: headers['user-agent'],
      ip: ip,
    })

    // TODO: переместить в отдельный сервис по работе с cookie (вместе с инициализацией)
    res.cookie('refreshToken', registerPayload.refreshSession.refreshToken, {
      path: '/api/auth',
      maxAge: registerPayload.refreshSession.expiresIn,
      secure: true,
      httpOnly: true,
    })

    return {
      accessToken: registerPayload.accessToken,
      refreshToken: registerPayload.refreshSession.refreshToken,
    }
  }

  @ApiOperation({ summary: 'Ручка обновления токена, ответ предусматривает создание новой сессии и запись refreshToken в cookie' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Headers() headers,
    @Ip() ip,
    @Body() refreshUserDto: RefreshDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshPayload = await this.authService.refresh({
      fingerprint: refreshUserDto.fingerprint,
      refreshToken: req.cookies['refreshToken'],
      userAgent: headers['user-agent'],
      ip: ip,
    })

    // TODO: переместить в отдельный сервис по работе с cookie (вместе с инициализацией)
    res.cookie('refreshToken', refreshPayload.refreshSession.refreshToken, {
      path: '/api/auth',
      maxAge: refreshPayload.refreshSession.expiresIn,
      secure: true,
      httpOnly: true,
    })

    return {
      accessToken: refreshPayload.accessToken,
      refreshToken: refreshPayload.refreshSession.refreshToken,
    }
  }

  @ApiOperation({ summary: 'Ручка верификации аккаунта по коду, пока моковый метод' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('verify')
  async verify(
    @Req() req: Request,
    @Body() verifyDto: VerifyDto,
  ) {
    await this.authService.verifyUser({
      ...verifyDto,
      refreshToken: req.cookies['refreshToken'],
    })
  }

  @ApiOperation({ summary: 'Ручка выхода из учетной записи/удаление активной сессии' })
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(req.cookies['refreshToken'])
    res.cookie('refreshToken', null)
  }

}
