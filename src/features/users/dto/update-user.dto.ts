import { PartialType } from '@nestjs/swagger'
import { IsBoolean, IsEmail } from 'class-validator'
import { Role } from '@prisma/client'

import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email?: string

  role?: Role

  @IsBoolean()
  isVerified?: boolean
}
