export enum EndpointGroup {
  Agent = 'agent',
  Backdrop = 'backdrop',
  Sport = 'sport'
}

export namespace EndpointGroup {
  export function values() {
    return Object.keys(EndpointGroup).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    );
  }
}
