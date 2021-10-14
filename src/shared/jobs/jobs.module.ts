import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MiddlewareBuilder } from '@nestjs/core';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { SendMailConsumer } from './sendMail-consumer';
import { SendMailProducerService } from './sendMail-producer-service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
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
  providers: [SendMailProducerService, SendMailConsumer],
  exports: [SendMailProducerService],
})
export class JobsModule {
  constructor(@InjectQueue('sendMail-queue') private sendMailQueue: Queue) {}
  configure(consumer: MiddlewareBuilder) {
    const { router } = createBullBoard([new BullAdapter(this.sendMailQueue)]);

    consumer.apply(router).forRoutes('admin/queues');
  }
}