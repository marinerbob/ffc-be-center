import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/modules/prisma/prisma.service'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
