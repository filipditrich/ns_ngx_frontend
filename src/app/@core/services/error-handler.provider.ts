import { ErrorHandler, Injectable} from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor() { }

  handleError(error) {

    // TODO: do some stuff here

    throw error;
  }

}
