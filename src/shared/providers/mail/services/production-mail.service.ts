import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { HandlebarsMailTemplateService } from '../../mail-template/handlebars-mail-template.service';
import SendMailDTO from '../dtos/send-mail.dto';

@Injectable()
export class ProductionMailService {
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
    await this.mailService.sendMail({
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
  }
}
