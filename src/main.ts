import { NestFactory } from '@nestjs/core'

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

  swaggerInstance.initSwagger(app)

  await app.listen(PORT, () => {
    loggerInstance.info(`Server started. Port ${PORT}`)
  })
}

bootstrap()
