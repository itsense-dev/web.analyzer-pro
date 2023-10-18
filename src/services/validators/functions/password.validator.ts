import { AbstractControl } from '@angular/forms';

const passwordRegEx: RegExp = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;

export function passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
  let value: string = control.value;
  if (!!value && !passwordRegEx.test(value)) return { 'password-weakness': true };

  return null;
}
