import { Injectable } from '@nestjs/common'
import { User, Password } from '@prisma/client'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

import { PrismaService } from 'src/common/modules/prisma/prisma.service'


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordId: createUserDto.passwordId,
        role: createUserDto.role,
      },
    })
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        password: true,
      },
    })
  }

  async getUserByEmail (email: string): Promise<User & { password: Password }> {
    return await this.prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        password: true,
      },
    })
  }

  // TODO: обновление пользователя
  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      data: {
        email: updateUserDto.email,
        role: updateUserDto.role,
      },
      where: {
        id,
      },
    })
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
