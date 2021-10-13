import { MailerService } from '@nestjs-modules/mailer';
import { getTestMessageUrl } from 'nodemailer';

import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { ISendMailDTO } from './sendMail-producer-service';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailService: MailerService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<ISendMailDTO>) {
    const { email, name } = job.data;

    const message = await this.mailService.sendMail({
      to: email,
      from: 'Equipe GBS <gbs@contato.com>',
      subject: 'Seja bem vindo(a)',
      text: `Olá ${name}, seu cadastro foi realizado com sucesso, seja bem vindo(a).`,
    });

    const previewURL = getTestMessageUrl(message);

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', previewURL);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`On Completed ${job.name}`);
  }

  @OnQueueProgress()
  onProgress(job: Job) {
    console.log(`On Progress ${job.name}`);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`On Active ${job.name}`);
  }
}

export { SendMailConsumer };
