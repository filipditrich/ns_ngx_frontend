import { findByProp } from '../helpers/functions.helper';
import { APIRoot } from '../../../environments/environment';

export let ENDPOINTS = {};

export function updateEndpoints(input) {
  ENDPOINTS = input;
}

export function getById(id: string, service: string) {
  return findByProp(ENDPOINTS[service], 'id', id);
}

export function getUrlById(module: string, id: string) {
  const res = findByProp(ENDPOINTS[module], 'id', id);
  return res ? res.url : undefined;
}

export function getUrl(module: string, id: string) {
  const endpoint = module === 'operator' ? getUrlById(module, id) : `/${module}${getUrlById(module, id)}`;
  return endpoint === undefined ?  `${APIRoot}` : `${APIRoot}/api${endpoint}`;
}
