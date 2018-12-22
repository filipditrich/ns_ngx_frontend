export enum UserRoles {
  admin = 'admin',
  player = 'player',
  super = 'super',
  mod = 'moderator',
  deleted = 'deleted',
}

export namespace UserRoles {
  export function values() {
    return Object.keys(UserRoles).filter((type) => isNaN(<any>type) && type !== 'values');
  }
}
