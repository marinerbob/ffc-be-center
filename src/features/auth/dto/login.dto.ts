import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    name: 'email',
    example: 'test@test.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    name: 'password',
    example: 'kI123123!',
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minSymbols: 1,
  })
  password: string

  // Временно
  @IsOptional()
  @IsString()
  fingerprint: string

  // refreshToken: string
}
