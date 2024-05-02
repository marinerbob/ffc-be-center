import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { UsersService } from '../users/users.service'

import { PasswordService } from './password/password.service'
import { JwtService } from './jwt/jwt.service'
import { LoginDto } from './dto/login.dto'


@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    ) {}

    async login(loginDto: LoginDto): Promise<boolean> {
      try {
        const user = await this.userService.getUserByEmail(loginDto.email)

        if (!user) throw new Error('User does not exist')
        
        const isPasswordSame = await this.passwordService.checkPassword(loginDto.password, user.password.value)

        if (!isPasswordSame) return false

        return true
      } catch (error) {
        throw new Error('Unexpected error')
      }
    }
  
}
