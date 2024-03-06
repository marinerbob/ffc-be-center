import { Role } from '@prisma/client'
import { IsEmail } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  genderId: string

  passwordId: string

  role: Role
}
