export enum UserRoles {
  admin = 'admin',
  player = 'player'
}

export namespace UserRoles {
  export function values() {
    return Object.keys(UserRoles).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
