import { findByProp } from '../helpers/functions.helper';
import { APIRoot, APIVersion } from '../../../environments/environment';

export let ENDPOINTS = {};

export function updateEndpoints(input) {
  ENDPOINTS = input;
}

export function getById(id: string, service: string) {
  return findByProp(ENDPOINTS[service], 'id', id);
}

export function getUrlById(id: string, service: string) {
  const res = findByProp(ENDPOINTS[service], 'id', id);
  return res ? res.url : undefined;
}

export function getUrl(id: string, service) {
  const endpoint = getUrlById(id, service);
  console.log(endpoint);
  return endpoint === undefined ?  `${APIRoot}` : `${APIRoot}/api/${APIVersion}/${service}${endpoint}`;
}
