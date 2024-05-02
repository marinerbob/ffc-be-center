import { User, $Enums as Enums } from '@prisma/client'
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
    name: 'passwordId',
    example: '<UUID-ID>',
  })
  @IsString()
  passwordId: User['passwordId']

  @ApiProperty({ enum: Enums.Role })
  role: User['role']
}
