import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { SignOptions, JwtPayload, sign, verify } from 'jsonwebtoken'

import { JwtAccessTokenPayloadEntity } from '../entities/jwt-access-token-payload.entity'

@Injectable()
export class JwtService {
  private secretKey: string
  private issuer: string

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get('JWT_SECRET_KEY')
    this.issuer = this.configService.get('SERVICE_NAME')
  }

  async signUser(user: User, expiresIn: SignOptions['expiresIn']): Promise<string> {
     const accessPayload = new JwtAccessTokenPayloadEntity()

     accessPayload.email = user.email
     accessPayload.userRole = user.role

    return await this.sign(accessPayload, { expiresIn })
  }

  async sign(payload: JwtPayload, options?: SignOptions): Promise<string> {
    return await sign({
      ...payload,
      iss: this.issuer,
    },
    this.secretKey,
    {
      ...options,
      algorithm: 'HS512',
    })
  }

  async verify(token: string): Promise<boolean> {
    const decoded = await verify(token, this.secretKey)

    return Boolean(decoded)
  }
}
