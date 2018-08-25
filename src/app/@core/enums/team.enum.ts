export enum Team {
  ns,
  other
}

export namespace Team {
  export function values() {
    return Object.keys(Team).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
