import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtService } from './jwt/jwt.service'
import { PasswordService } from './password/password.service'
import { SessionsService } from './sessions/sessions.service'

import { PrismaModule } from '~/common/modules/prisma/prisma.module'
import { MailerModule } from '~/common/modules/mailer/mailer.module'

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    MailerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, PasswordService, SessionsService],
})
export class AuthModule {}
