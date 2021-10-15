import { resolve } from 'path';

const emailConfirmation = resolve(
  __dirname,
  '..',
  'modules',
  'users',
  'views',
  'email-confirmation.hbs',
);

const forgotPassword = resolve(
  __dirname,
  '..',
  'modules',
  'users',
  'views',
  'forgot-password.hbs',
);
export default {
  emailConfirmation,
  forgotPassword,
};
