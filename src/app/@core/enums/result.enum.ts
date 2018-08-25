export enum MatchResult {
  win = 'Win',
  loose = 'Loose',
  draft = 'Draft'
}

export namespace MatchResult {
  export function values() {
    return Object.keys(MatchResult).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
