export default interface MailTemplateProviderDTO {
  file: string;
  variables: IVariables;
}

interface IVariables {
  [key: string]: string | number;
}
