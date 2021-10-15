import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsMailTemplateService } from '../mail-template/handlebars-mail-template.service';
import { EtherealMailService } from './services/ethereal-mail.service';
import { ProductionMailService } from './services/production-mail.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
  ],
  providers: [
    EtherealMailService,
    ProductionMailService,
    HandlebarsMailTemplateService,
  ],
  exports: [EtherealMailService, ProductionMailService],
})
export class MailModule {}
