import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordStrength(regExp?: RegExp): ValidatorFn {
  const strong = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})');
  const medium = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{4,})');
  return (control: AbstractControl): {[key: string]: any} | null => {
    let strength;
    if (strong.test(control.value)) {
      strength = false;
    } else if (medium.test(control.value)) {
      strength = 2;
    } else if (control.value !== null) {
      strength = 1;
    } else {
      strength = '0';
    }
    return strength !== false ? { 'passwordStrength' : { strength: strength } } : null;
  };
}

export function passwordConfirmation(t?: any): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any | null} => {

    const pwd = control.get('password').value;
    const compare = control.get('passwordSubmit').value;
    let match = pwd === compare;
    if (pwd === null || compare === null) { match = false; }

    return match ? null : { 'passwordConfirmation' : { match: false } };

  };

}

export function isUpperCase(): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any | null} => {

    const isLower = control.value ? /^[a-z0-9_]+$/.test(control.value) : false;

    return isLower ? null : { 'is-upper-case' : true };

  };

}

export function isEmail(): ValidatorFn {

  return (control: AbstractControl): {[key: string]: any | null} => {
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = control.value ? regexp.test(control.value) : true;

    return valid ? null : { 'email' : true };

  }

}
