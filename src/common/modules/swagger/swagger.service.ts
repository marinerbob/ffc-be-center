import { INestApplication, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { SwaggerConfig } from 'src/common/configs/types'

@Injectable()
export class SwaggerService {
  constructor(private readonly configService: ConfigService) {}

  initSwagger(app: INestApplication): void {
    const swaggerConfig = this.configService.get<SwaggerConfig>('swagger')
    const options = new DocumentBuilder()
      .setTitle(this.configService.get('SERVICE_NAME') ?? swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(
        this.configService.get('npm_package_version') ?? swaggerConfig.version,
      )
      .build()
    const document = SwaggerModule.createDocument(app, options)

    SwaggerModule.setup(swaggerConfig.path, app, document)
  }
}
