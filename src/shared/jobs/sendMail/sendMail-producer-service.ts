import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import SendMailDTO from '../../providers/mail/dtos/send-mail.dto';

@Injectable()
class SendMailProducerService {
  constructor(@InjectQueue('sendMail-queue') private queue: Queue) {}

  async sendMail(confirmationUser: SendMailDTO) {
    await this.queue.add('sendMail-job', confirmationUser, {
      // options
    });
  }
}

export { SendMailProducerService };
