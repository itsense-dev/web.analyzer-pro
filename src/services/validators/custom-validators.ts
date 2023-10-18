import { emailValidator } from './functions/email.validator';
import { equalTo } from './functions/equalTo.validator';
import { linkValidator } from './functions/link.validator';
import { passwordValidator } from './functions/password.validator';

export const CustomValidators = {
  email: emailValidator,
  password: passwordValidator,
  equalTo: equalTo,
  link: linkValidator,
};
