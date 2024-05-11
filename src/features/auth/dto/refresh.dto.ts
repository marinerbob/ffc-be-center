import { IsOptional, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshDto {
  // Временно опционально
  @ApiProperty({
    name: 'fingerprint',
    example: '<base64-string>',
  })
  @IsOptional()
  @IsString()
  fingerprint: string

  // refreshToken: string
}
