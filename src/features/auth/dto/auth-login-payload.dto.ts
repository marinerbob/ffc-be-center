import { IsIP, IsString, MaxLength, IsOptional } from 'class-validator'

import { LoginDto } from './login.dto'

export class AuthLoginPayloadDto extends LoginDto {
  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  userAgent?: string

  @IsOptional()
  // @IsNotEmpty()
  @IsIP('4')
  ip?: string
}