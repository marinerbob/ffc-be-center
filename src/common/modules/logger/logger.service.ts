import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { createLogger, transports, format, Logger } from 'winston'

import { Nullable } from 'src/common/models'

// Тестовый логгер-сервис с транспортом в консоль
// В будущем перейдем на валидное решение с записью в сервис/файл
@Injectable()
export class LoggerService implements OnApplicationBootstrap {
  private logger: Nullable<Logger> = null

  onApplicationBootstrap(): void {
    const { combine, timestamp, label, prettyPrint } = format

    this.logger = createLogger({
      format: combine(
        label({ label: `[${process.env.SERVICE_NAME ?? 'FFC-BE-CENTER'}]` }),
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
