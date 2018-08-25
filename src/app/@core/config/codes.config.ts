import { ICode } from '../models/config.interface';
import { findByProp } from '../helpers/functions.helper';

export let CODES = {};

export function updateCodes(input: ICode | ICode[]) {
  CODES = input;
}

export function getCodeByName(name: string, service) {
  return findByProp(CODES[service], 'name', name);
}
