import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResource } from '../../@shared/interfaces';
import { APIRoot } from '../../../environments/environment';

import { updateSysInfo } from '../../@shared/helpers/sysinfo.helper';
import { updateTranslateList } from '../../@shared/helpers/translator.helper';
import * as codes from '../../@shared/config/codes.config';
import * as endpoints from '../../@shared/config/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class PreloadInitializer {

  constructor(private http: HttpClient) { }

  startupConfig(): Promise<any> {
    return Promise.all([
      this.obtainCodes(),
      this.obtainRoutes(),
      this.obtainTranslateList(),
      this.obtainAppInfo(),
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
        } else {
          console.error('[PRELOAD:FAIL] Haven\'t received any routes!', result);
        }
      }, error => {
        console.error('[PRELOAD:FAIL] Error occurred while receiving routes!', error);
      });
  }

  obtainTranslateList(): Promise<any> {
    const headers = new HttpHeaders()
      .append('X-Secret', '937a43fc73c501dfa94d7dcf0cf668e0x7');

    return this.http.get<IResource>(`${APIRoot}/api/sys/translate`, { headers })
      .toPromise()
      .then(result => {
        if (result.output) {
          updateTranslateList(result.output);
        } else {
          console.error('[PRELOAD:FAIL] Haven\'t received translate list!', result);
        }
      }, error => {
        console.error('[PRELOAD:FAIL] Error occurred while receiving translate list!', error);
      });
  }

  obtainAppInfo(): Promise<any> {
    const headers = new HttpHeaders()
      .append('X-Secret', '937a43fc73c501dfa94d7dcf0cf668e0x7');

    return this.http.get<IResource>(`${APIRoot}/api/sys/appinfo`, { headers })
      .toPromise()
      .then(result => {
        if (result.output) {
          updateSysInfo(result.output);
        } else {
          console.error('[PRELOAD:FAIL] Haven\'t received any app info!', result);
        }
      }, error => {
        console.error('[PRELOAD:FAIL] Error occurred while receiving app info!', error);
      });
  }

}
