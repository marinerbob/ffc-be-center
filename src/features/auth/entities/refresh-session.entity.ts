import {
  IsUUID,
  IsIP,
  IsString,
  MaxLength,
  IsNumber,
  IsNotEmpty,
} from 'class-validator'
import { User } from '@prisma/client'

export class RefreshSessionEntity {
  @IsNotEmpty()
  @IsUUID('4')
  userId: User['id']

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  userAgent: string

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  fingerPrint: string

  @IsNotEmpty()
  @IsIP('4')
  ip: string

  @IsNotEmpty()
  @IsNumber()
  expiresIn: number
}
