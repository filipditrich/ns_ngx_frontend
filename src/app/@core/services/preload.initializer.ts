import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResource } from '../models/config.interface';
import { APIRoot } from "../../../environments/environment";
import { forEach } from 'lodash';

import * as codes from '../config/codes.config';
import * as endpoints from '../config/endpoints.config';


@Injectable({
  providedIn: 'root'
})
export class PreloadInitializer {

  constructor(private http: HttpClient) { }

  startupConfig(): Promise<any> {
    return Promise.all([
      this.obtainCodes(),
      this.obtainRoutes()
    ]);
  }

  // TODO - code model ?
  obtainCodes(): Promise<any> {

    const headers = new HttpHeaders()
      .append('X-Secret', '937a43fc73c501dfa94d7dcf0cf668e0x7');

    // TODO - <any> => resource interface
    return this.http.get<IResource>(`${APIRoot}/api/sys/codes`, { headers })
      .toPromise()
      .then(result => {
        if (result.output) {
          codes.updateCodes(result.output);
          console.log(`[PRELOAD:OK]: ${codes.getCodeByName('RESOURCE_LOADED', 'system').name} - Codes`);
        } else {
          console.error('[PRELOAD:FAIL] Haven\'t received any codes!', result);
        }
      }, error => {
        console.error('[PRELOAD:FAIL] Error occurred while receiving codes!', error);
      });
  }

  obtainRoutes(): Promise<any> {

    const headers = new HttpHeaders()
      .append('X-Secret', '937a43fc73c501dfa94d7dcf0cf668e0x7');


    return this.http.get<IResource>(`${APIRoot}/api/sys/routes`, { headers })
      .toPromise()
      .then(result => {
        if (result.output) {
          endpoints.updateEndpoints(result.output);
          console.log(`[PRELOAD:OK]: ${codes.getCodeByName('RESOURCE_LOADED', 'system').name} - Routes`);
          console.log(result.output)
        } else {
          console.error('[PRELOAD:FAIL] Haven\'t received any routes!', result);
        }
      }, error => {
        console.error('[PRELOAD:FAIL] Error occurred while receiving routes!', error);
      });
  }

}
