import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { EtherealMailService } from '../../providers/mail/services/ethereal-mail.service';
import SendMailDTO from '../../providers/mail/dtos/send-mail.dto';

@Processor('sendMail-queue')
class SendMailConsumer {
  constructor(private mailService: EtherealMailService) {}

  @Process('sendMail-job')
  async sendMailJob(job: Job<SendMailDTO>) {
    const { to, subject, templateData } = job.data;

    await this.mailService.sendMail({
      to: {
        email: to.email,
        name: to.name,
      },
      subject,
      templateData: templateData,
    });
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
