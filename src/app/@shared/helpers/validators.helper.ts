import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

/**
 * @description Returns the strength of a password
 * @param {RegExp} regExp
 * @return {ValidatorFn}
 */
export function passwordStrength(regExp?: RegExp): ValidatorFn {
  const strong = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{4,})');
  const medium = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{3,})');
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

/**
 * @description If passwordSubmit field value equals password field value
 * @param t
 * @return {ValidatorFn}
 */
export function passwordConfirmation(t?: any): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any | null} => {
    const pwd = control.get('password').value;
    const compare = control.get('passwordSubmit').value;
    let match = pwd === compare;
    if (pwd === null || compare === null) { match = false; }

    return match ? null : { 'passwordConfirmation' : { match: false } };
  };
}

/**
 * @description If value is all uppercase
 * @return {ValidatorFn}
 */
export function isUpperCase(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any | null} => {
    // TODO: check the validity of this, now I'm not sure if its going to work
    // with this regexp
    const isLower = control.value ? /^[a-z0-9_]+$/.test(control.value) : false;
    return isLower ? null : { 'is-upper-case' : true };
  };
}

/**
 * @description If value is a valid email address
 * @return {ValidatorFn}
 */
export function isEmail(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any | null} => {
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const valid = control.value ? regexp.test(control.value) : true;

    return valid ? null : { 'email' : true };

  };
}

/**
 * @description If value is a string
 * @return {ValidatorFn}
 */
export function isString(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any | null} => {
    return (control.value === null || control.value === '') ? null
      : typeof control.value === 'string' && isNaN(Number(control.value)) ? null : { 'isString': true };
  };
}

/**
 * @description If value is a valid number
 * @return {ValidatorFn}
 */
export function isNumber(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any | null} => {
    return (control.value === null || control.value === '') ? null
      : !isNaN(Number(control.value)) ? null : { 'isNumber': true };
  };
}

/**
 * @description If date value of <first> is less than date value of <second>
 * @param {string} first
 * @param {string} second
 * @return {ValidatorFn}
 */
export function dateLessThan(first: string, second: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any | null} => {
    const firstDate = control.get(first).value;
    const secondDate = control.get(second).value;

    let valid = !firstDate && !secondDate ? true : moment(firstDate).isBefore(secondDate);
    if (firstDate === null || secondDate === null) { valid = true; }

    return valid ? null : { 'dateLessThan' : true };

  };
}
