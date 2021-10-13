import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

export type ISendMailDTO = {
  name: string;
  email: string;
};

@Injectable()
class SendMailProducerService {
  constructor(@InjectQueue('sendMail-queue') private queue: Queue) {}

  async sendMail(createUserDTO: ISendMailDTO) {
    await this.queue.add('sendMail-job', createUserDTO, {
      // options
    });
  }
}

export { SendMailProducerService };
