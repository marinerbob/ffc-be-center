import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppService } from './app.service'

import { ValidationPipe } from '~/common/pipes/validation.pipe'
import { LoggerService } from '~/common/modules/logger/logger.service'
import { SwaggerService } from '~/common/modules/swagger/swagger.service'
import { PrismaModule } from '~/common/modules/prisma/prisma.module'
import config from '~/common/configs/main'
import { MailerModule } from '~/common/modules/mailer/mailer.module'
import { UsersModule } from '~/features/users/users.module'
import { AuthModule } from '~/features/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MailerModule,
  ],
  providers: [
    AppService,
    LoggerService,
    SwaggerService,
    ValidationPipe,
  ],
})
export class AppModule {}
