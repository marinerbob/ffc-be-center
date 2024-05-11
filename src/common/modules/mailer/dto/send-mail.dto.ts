import { SendMailOptions } from 'nodemailer'

export type SendMailDto = Pick<SendMailOptions, 'to' | 'subject' | 'cc' | 'html'>