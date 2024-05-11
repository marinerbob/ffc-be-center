import { IsUUID, IsOptional, IsNumber } from 'class-validator'

import { UserSessionPayloadDto } from '../dto/user-session-payload.dto'

// Закомментировано для теста не из браузера
export class RefreshSessionEntity extends UserSessionPayloadDto {
  @IsOptional()
  @IsUUID('4')
  refreshToken?: string

  @IsOptional()
  // @IsNotEmpty()
  @IsNumber()
  expiresIn?: number
}
