import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
// import { createTransport } from 'nodemailer'

import { AppModule } from './app.module'
import { LoggerService } from './common/modules/logger/logger.service'
import { SwaggerService } from './common/modules/swagger/swagger.service'
import { ValidationPipe } from './common/pipes/validation.pipe'

async function bootstrap() {
  const PORT = process.env.PORT || 3000

  const app = await NestFactory.create(AppModule)
  const loggerInstance = app.get(LoggerService)
  const swaggerInstance = app.get(SwaggerService)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  app.use(cookieParser(process.env.COOKIES_SECRET_KEY))

  swaggerInstance.initSwagger(app)

  // const transporter = createTransport({
  //   service: 'yandex',
  //   host: 'smtp.yandex.ru',
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     user: 'hoods.tech-test@yandex.ru',
  //     pass: 'nwbxwxyjehqflmem',
  //   },
  // })

  // const message = {
  //   from: 'Hoods <hoods.tech-test@yandex.ru>',
  //   to: 'robobson@mail.ru',
  //   subject: 'hihihihh HAHAHAHAH',
  //   text: 'hsadasdqwe qsqd qweqssweq qxqd qwe',
  // }

  // await transporter.sendMail(message)

  await app.listen(PORT, () => {
    loggerInstance.info(`Server started. Port ${PORT}`)
  })
}

bootstrap()
