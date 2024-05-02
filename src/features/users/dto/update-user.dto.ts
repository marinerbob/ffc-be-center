import { PartialType } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'
import { Role } from '@prisma/client'

import { CreateUserDto } from './create-user.dto'

// TODO: обновление данных пользователя
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email?: string

  role?: Role
}
