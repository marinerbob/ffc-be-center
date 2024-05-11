import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Transporter, createTransport, SendMailOptions } from 'nodemailer'

import { SendMailDto } from './dto/send-mail.dto'

import { Nullable } from '~/common/models'

@Injectable()
export class MailerService implements OnApplicationBootstrap {
  private transport: Nullable<Transporter> = null

  constructor(private readonly configService: ConfigService) {}

  onApplicationBootstrap() {
    try {
      this.transport = createTransport({
        service: this.configService.getOrThrow('MAIL_SERVICE'),
        host: this.configService.getOrThrow('MAIL_SMTP_HOST'),
        port: this.configService.getOrThrow('MAIL_SMTP_PORT'),
        secure: true,
        auth: {
          user: this.configService.getOrThrow('MAIL_USER'),
          pass: this.configService.getOrThrow('MAIL_PASSWORD'),
        },
      })
    } catch (error) {
      // logging
      console.error(error)
    }
  }

  async sendMail(sendParams: SendMailDto): Promise<void> {
    try {
      await this.transport.sendMail(this.getDefaultMessageTemplate(sendParams))
    } catch (error) {
      // logging of throwing
      console.error(error)
    }
  }

  getDefaultMessageTemplate(sendParams: SendMailDto): SendMailOptions {
    return {
      from: `${this.configService.get('APP_NAME') ?? 'Hoods'} <${this.configService.get('MAIL_USER')}>`,
      to: sendParams.to,
      subject: sendParams.subject,
      html: sendParams.html,
    }
  }
}
