import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IResource } from '../../@shared/interfaces';
import { APIRoot } from '../../../environments/environment';

import { updateSysInfo, updateTranslateList } from '../../@shared/helpers/';
import { updateEndpoints } from '../../@shared/config/endpoints.config';
import { updateCodes } from '../../@shared/config/codes.config';

@Injectable({
  providedIn: 'root',
})
export class PreloadInitializer {

  constructor(private http: HttpClient) { }

  startupConfig(): Promise<any> {
    return this.serverAssets();
  }

  serverAssets(): Promise<any> {

    const headers = new HttpHeaders()
      .append('X-Secret', '937a43fc73c501dfa94d7dcf0cf668e0x7');

    return this.http.get<IResource>(`${APIRoot}/api/sys/assets`, { headers })
      .toPromise()
      .then(result => {
        if (result.output) {
          updateCodes(result.output['codes']);
          updateEndpoints(result.output['routes']);
          updateTranslateList(result.output['translateList']);
          updateSysInfo(result.output['sysInfo']);
        } else {
          console.error('[PRELOAD:FAIL] No server assets available!', result);
        }
      }, error => {
        console.error('[PRELOAD:FAIL] Error occurred while receiving server assets!', error);
      });

  }

}
