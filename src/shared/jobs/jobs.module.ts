import { BullModule, InjectQueue } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareBuilder } from '@nestjs/core';
import { Queue } from 'bull';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { MailModule } from '../providers/mail/mail.module';
import { SendMailConsumer } from './sendMail/sendMail-consumer';
import { SendMailProducerService } from './sendMail/sendMail-producer-service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_QUEUE_HOST,
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'sendMail-queue',
    }),
    MailModule,
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
