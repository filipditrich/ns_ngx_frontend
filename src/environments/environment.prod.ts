/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  name: 'prod',
  production: true,
};

export const APIRoot = 'http://167.99.142.181:4000';
export let LANG = 'cs';
export function changeLang(lang: string): void {
  LANG = lang;
}
