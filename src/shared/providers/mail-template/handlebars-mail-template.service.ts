import { Injectable } from '@nestjs/common';
import handlebars from 'handlebars';
import { promises } from 'fs';
import ParseMailTemplateDTO from './dto/parse-mail-template.dto';

@Injectable()
export class HandlebarsMailTemplateService {
  public async parse({
    file,
    variables,
  }: ParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parseTemplate = handlebars.compile(templateFileContent);
    return parseTemplate(variables);
  }
}
