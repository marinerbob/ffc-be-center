import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { JwtService } from './jwt/jwt.service'
import { PasswordService } from './password/password.service'

@Module({
  controllers: [AuthController],
  providers: [JwtService, PasswordService],
})
export class AuthModule {}
