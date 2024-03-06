import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service'
import { PrismaService } from './common/modules/prisma/prisma.service'
import { LoggerService } from './common/modules/logger/logger.service'
import { SwaggerService } from './common/modules/swagger/swagger.service'
import { AuthService } from './features/auth/auth.service'
import { AuthModule } from './features/auth/auth.module'
import { UsersModule } from './features/users/users.module'
import config from './common/configs/main'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: `.env.${process.env.NODE_ENV}.local`,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [
    AppService,
    PrismaService,
    LoggerService,
    SwaggerService,
    AuthService,
  ],
})
export class AppModule {}
