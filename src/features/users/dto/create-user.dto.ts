import { Role } from '@prisma/client'
import { IsEmail } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    name: 'email',
    example: 'test@test.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    name: 'genderId',
    example: '<UUID-ID>',
  })
  genderId: string

  @ApiProperty({
    name: 'passwordId',
    example: '<UUID-ID>',
  })
  passwordId: string

  @ApiProperty({
    name: 'role',
    examples: ['USER', 'ADMIN'],
    example: 'USER',
  })
  role: Role
}
