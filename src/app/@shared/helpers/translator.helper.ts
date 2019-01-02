import { LANG } from '../../../environments/environment';

export let translateIdList = {
  ADMIN: { cs: 'Administrátor', en: 'Administrator' },
  HOME: { cs: 'Domů', en: 'Home' },
  MATCH_GROUP: {cs: 'Skupina zápasů', en: 'Match group'},
  MATCH_DETAIL: {cs: 'Detail zápasu', en: 'Match detail'},
  GOLDEN_STICK: { cs: 'Zlatá hokejka', en: 'Golden stick' },
  TRIPLE_CLUB: { cs: 'Triple club', en: 'Triple club' },
  REPRESENTATION: { cs: 'Reprezentace', en: 'Representation' },
  NOT_FOUND: { cs: 'Nenalezeno', en: 'Not found' },
  PROFILE: { cs: 'Profil', en: 'Profile' },
  MATCHES: { cs: 'Zápasy', en: 'Matches' },
  MATCH_RESULTS: { cs: 'Výsledky', en: 'Match results' },
  MATCH_MANAGER: { cs: 'Správce zápasů', en: 'Match manager' },
  EDIT_MATCH: { cs: 'Upravit zápas', en: 'Edit match' },
  GROUP_MANAGER: { cs: 'Správce skupin', en: 'Group manager' },
  EDIT_GROUP: { cs: 'Upravit skupinu', en: 'Edit group' },
  TEAM_MANAGER: { cs: 'Správce týmů', en: 'Team manager' },
  EDIT_TEAM: { cs: 'Upravit tým', en: 'Edit team' },
  PLACE_MANAGER: { cs: 'Správce míst', en: 'Place manager' },
  EDIT_PLACE: { cs: 'Upravit míst', en: 'Edit place' },
  JERSEY_MANAGER: { cs: 'Správce dresů', en: 'Jersey manager' },
  EDIT_JERSEY: { cs: 'Upravit dres', en: 'Edit jersey' },
  REGISTRATION_REQUESTS: { cs: 'Registrační žádosti', en: 'Registration requests' },
  REALISATION_TEAM: { cs: 'Realizační tým', en: 'Realisation team' },
  CLUB_AWARDS: { cs: 'Klubová ocenění', en: 'Club awards' },
  SETTINGS: { cs: 'Nastavení', en: 'Settings' },
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
