import { Module } from '@nestjs/common'

import { UsersModule } from '../users/users.module'

import { AuthController } from './auth.controller'
import { JwtService } from './jwt/jwt.service'
import { PasswordService } from './password/password.service'
import { AuthService } from './auth.service'

import { PrismaModule } from 'src/common/modules/prisma/prisma.module'

@Module({
  imports: [
    PrismaModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, PasswordService],
  exports: [JwtService, PasswordService],
})
export class AuthModule {}
