import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createLogger, transports, format, Logger } from 'winston'

import { Nullable } from '~/common/models'

// TODO: Тестовый логгер-сервис с транспортом в консоль
// TODO: В будущем перейдем на валидное решение с записью в сервис/файл
@Injectable()
export class LoggerService implements OnApplicationBootstrap {
  private logger: Nullable<Logger> = null

  constructor(private readonly configService: ConfigService) { }

  onApplicationBootstrap(): void {
    const { combine, timestamp, label, prettyPrint } = format

    this.logger = createLogger({
      format: combine(
        label({ label: `[${this.configService.get('SERVICE_NAME') ?? 'FFC-BE-CENTER'}]` }),
        timestamp(),
        prettyPrint(),
      ),
      transports: [new transports.Console()],
    })
  }

  info(message: string): void {
    this.logger?.log({
      level: 'info',
      message,
    })
  }

  error(message: string): void {
    this.logger?.log({
      level: 'error',
      message,
    })
  }
}
