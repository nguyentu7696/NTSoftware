import { ErrorStateMatcher } from "@angular/material/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  AbstractControl,
  FormGroup,
  ValidationErrors
} from "@angular/forms";
interface ValidatorFn {
  (c: AbstractControl): ValidationErrors | null;
}
export class StateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
export const passwordMatchValidator = (fg: FormGroup) => {
  const passwordHash = fg.get("password").value;
  const confirmPassword = fg.get("confirmPassword").value;

  return passwordHash === confirmPassword ? null : { noMatch: true };
};
export class DateLessThanNow {
  static dateVaidator(AC: AbstractControl) {
    if (
      AC &&
      AC.value <
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()
        )
    ) {
      return { dateVaidator: true };
    }
    return null;
  }
}
export class DateCanWork {
  static dateValidator(AC: AbstractControl) {
    if (
      AC &&
      (AC.value >
        new Date(
          new Date().getFullYear() - 15,
          new Date().getMonth(),
          new Date().getDate()
        ) ||
        AC.value <
          new Date(
            new Date().getFullYear() - 65,
            new Date().getMonth(),
            new Date().getDate()
          ))
    ) {
      return { dateValidator: true };
    }
    return null;
  }
}
export class DateGranter18 {
  static dateValidator(AC: AbstractControl) {
    if (
      AC &&
      (AC.value >
        new Date(
          new Date().getFullYear() - 18,
          new Date().getMonth(),
          new Date().getDate()
        ) ||
        AC.value <
          new Date(
            new Date().getFullYear() - 65,
            new Date().getMonth(),
            new Date().getDate()
          ))
    ) {
      return { dateValidator: true };
    }
    return null;
  }
}
export class DateLessThanControl {
  static dateLessThan(
    dateField1: string,
    dateField2: string,
    validatorField: { [key: string]: boolean }
  ): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const date1 = c.get(dateField1).value;
      const date2 = c.get(dateField2).value;
      if (date1 !== null && date2 !== null && date1 > date2) {
        return validatorField;
      }
      return null;
    };
  }
}
export class EmptyOrNull {
  static SpaceValidator(AC: AbstractControl) {
    if (AC && AC.value.toString().trim().length === 0) {
      return { required: true };
    }
    return null;
  }
}
export class InRange {
  static Validate(AC: AbstractControl) {
    if (
      AC &&
      AC.value.toString().trim().length != 9 &&
      AC.value.toString().trim().length != 12
    ) {
      return { range: true };
    }
    return null;
  }
}
