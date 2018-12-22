import { LANG } from '../../../environments/environment';

export let translateIdList = {
  ADMIN: { cs: 'Administrátor', en: 'Administrator' },
  MATCHES: { cs: 'Zápasy', en: 'Matches' },
  MATCH_RESULTS: { cs: 'Výsledky', en: 'Match results' },
  MATCH_MANAGER: { cs: 'Správce zápasů', en: 'Match manager' },
  GROUP_MANAGER: { cs: 'Správce skupin', en: 'Group manager' },
  TEAM_MANAGER: { cs: 'Správce týmů', en: 'Team manager' },
  PLACE_MANAGER: { cs: 'Správce míst', en: 'Place manager' },
  JERSEY_MANAGER: { cs: 'Správce dresů', en: 'Jersey manager' },
  REGISTRATION_REQUESTS: { cs: 'Registrační žádosti', en: 'Registration requests' },
};

/**
 * @description Updates translate list
 * @param update
 */
export function updateTranslateList(update) {
  translateIdList = update;
}

/**
 * @description Returns translated value from matched ID
 * @param {string} id
 * @param data
 * @param {string} lang
 * @return {string}
 */
export function translate(id: string, data?: any, lang?: string): string {
  let output: string;
  let string = translateIdList[id];
  if (!string) { console.error('[TRANSLATE] Error: id "%s" not found', id); }
  lang = !!lang ? lang : getLang();
  string = !string ? id : !lang ? id : string[lang];
  if (!string) { output = id; } else {
    let replace = string.match(/\[(.*?)\]/g);
    if (!!data && !!replace) {
      replace = replace.map(a => a.replace(/[\[\]]/g, ''));
      replace.forEach(r => { string = string.replace(r, data[r]); });
    }
    output = string.replace(/[\[\]]/g, '');
  }
  return output;
}

/**
 * @description Returns active language
 * @return {string}
 */
export function getLang(): string {
  return LANG;
}
