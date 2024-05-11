import { IsEmail, IsString } from 'class-validator'
import { User, $Enums as Enums } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    name: 'email',
    example: 'test@test.com',
  })
  @IsEmail()
  email: User['email']

  @ApiProperty({
    name: 'passwordHash',
    example: '<UUID-ID>',
  })
  @IsString()
  passwordHash: User['passwordHash']

  @ApiProperty({ enum: Enums.Role })
  role: User['role']
}
