let SYS_INFO = {};

/**
 * @description Updates system info
 * @param update
 */
export function updateSysInfo(update) {
  SYS_INFO = update;
}

/**
 * @description Returns ID specific system info
 * @param {string} id
 * @return {string}
 */
export function sysInfo(id: string): string {
  return !SYS_INFO[id] ? id : SYS_INFO[id];
}
