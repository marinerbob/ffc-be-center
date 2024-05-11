import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

import { PrismaService } from 'src/common/modules/prisma/prisma.service'


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create({ email, passwordHash, role }: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: { email, passwordHash, role },
    })
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { email },
    })
  }

  async getUserById(id: string): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { id },
    })
  }

  update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      data: updateUserDto,
      where: {
        id,
      },
    })
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
