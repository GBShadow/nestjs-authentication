import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { getTestMessageUrl } from 'nodemailer';
import { HandlebarsMailTemplateService } from '../../mail-template/handlebars-mail-template.service';
import SendMailDTO from '../dtos/send-mail.dto';

@Injectable()
export class EtherealMailService {
  constructor(
    private mailService: MailerService,
    private mailTemplateService: HandlebarsMailTemplateService,
  ) {}

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: SendMailDTO): Promise<void> {
    const message = await this.mailService.sendMail({
      from: {
        name: from?.name || 'Nome da equipe',
        address: from?.email || 'equipe@contato.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateService.parse(templateData),
    });

    const previewURL = getTestMessageUrl(message);

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', previewURL);
  }
}
