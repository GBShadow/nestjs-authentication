export default interface MailTemplateProviderDTO {
  file: string;
  variables: Variables;
}

interface Variables {
  [key: string]: string | number;
}
