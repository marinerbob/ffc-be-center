import { PartialType } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'
import { CreateUserDto } from './create-user.dto'
import { Role } from '@prisma/client'

// TODO: обновление данных пользователя
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email?: string

  role?: Role
}
