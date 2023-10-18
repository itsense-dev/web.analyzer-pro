import { AbstractControl, ValidatorFn } from '@angular/forms';

export function equalTo(target: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let targetControl = control.parent?.get(target);
    if (targetControl && targetControl.value !== control.value) return { 'field-unequal': true };

    return null;
  };
}
