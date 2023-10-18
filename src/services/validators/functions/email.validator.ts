import { AbstractControl } from '@angular/forms';

const emailRegEx: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

export function emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
  let value: string = control.value;
  if (!!value && !emailRegEx.test(value)) return { email: true };

  return null;
}
