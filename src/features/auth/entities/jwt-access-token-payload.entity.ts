import { IsNotEmpty, IsEmail, IsString } from 'class-validator'

export class JwtAccessTokenPayloadEntity {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  userRole: string
}