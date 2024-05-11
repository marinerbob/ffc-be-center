import { IsUUID, IsIP, IsString, MaxLength, IsNotEmpty, IsOptional } from 'class-validator'
import { User } from '@prisma/client'

// Закомментировано для теста не из браузера
export class UserSessionPayloadDto {
  @IsNotEmpty()
  @IsUUID('4')
  userId: User['id']

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  userAgent?: string

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  fingerprint?: string

  @IsOptional()
  // @IsNotEmpty()
  @IsIP()
  ip?: string
}
