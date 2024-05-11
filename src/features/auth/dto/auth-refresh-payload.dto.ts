import { IsIP, IsString, IsUUID, MaxLength, IsOptional } from 'class-validator'

import { RefreshDto } from './refresh.dto'

export class AuthRefreshPayloadDto extends RefreshDto {
  @IsOptional()
  @IsUUID('4')
  refreshToken?: string

  @IsOptional()
  // @IsNotEmpty()
  @IsIP('4')
  ip?: string

  @IsOptional()
  // @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  userAgent?: string
}