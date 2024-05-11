import { IsNumber } from 'class-validator'

export class VerifyDto {
  @IsNumber()
  verificationCode: number
}