import { ICode } from '../models/config.interface';
import { findByProp } from '../helpers/functions.helper';

export let CODES = {};

export function updateCodes(input: ICode | ICode[]) {
  CODES = input;
}

export function getCodeByName(name: string, service) {
  let result;
  if (CODES !== {} && !!CODES[service]) {
    result = findByProp(CODES[service], 'name', name);
  } else { result = 'UNDEFINED_ERROR'; }
  return !!result ? result : 'UNDEFINED';
}
