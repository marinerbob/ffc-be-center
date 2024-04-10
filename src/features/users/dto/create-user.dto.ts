import { User } from '@prisma/client'
import { IsEmail, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    name: 'email',
    example: 'test@test.com',
  })
  @IsEmail()
  email: User['email']

  @ApiProperty({
    name: 'genderId',
    example: '<UUID-ID>',
  })
  @IsString()
  genderId: User['genderId']

  @ApiProperty({
    name: 'passwordId',
    example: '<UUID-ID>',
  })
  @IsString()
  passwordId: User['passwordId']

  @ApiProperty({ enum: ['ADMIN', 'USER'] })
  role: User['role']
}
