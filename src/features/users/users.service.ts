import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordId: createUserDto.passwordId,
        genderId: createUserDto.genderId,
        role: createUserDto.role,
      },
    })
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
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
