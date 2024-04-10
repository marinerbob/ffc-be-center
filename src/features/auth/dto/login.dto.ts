import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string

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
  fingerPrint: string

  // refreshToken: string
}
