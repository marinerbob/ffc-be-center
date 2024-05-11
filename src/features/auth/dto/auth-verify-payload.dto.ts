import { IsOptional, IsUUID } from 'class-validator'

import { VerifyDto } from './verify.dto'

export class AuthVerifyPayloadDto extends VerifyDto {
  @IsOptional()
  @IsUUID('4')
  refreshToken?: string
}