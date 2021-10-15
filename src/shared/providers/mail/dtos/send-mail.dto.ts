import ParseMailTemplateDTO from '../../mail-template/dto/parse-mail-template.dto';

interface MailContact {
  name: string;
  email: string;
}

export default interface SendMailDTO {
  to: MailContact;
  from?: MailContact;
  subject: string;
  templateData: ParseMailTemplateDTO;
}
