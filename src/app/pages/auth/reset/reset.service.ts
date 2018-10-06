import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getUrl } from '../../../@core/config/endpoints.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CredResetService {f

  constructor(private http: HttpClient) { }

  // TODO - Interfaces

  requestPasswordReset(payload): Observable<any> {
    return this.http.post(getUrl( 'operator','PWD_FGT'), payload);
  }

  sendUsernameToEmail(payload): Observable<any> {
    return this.http.post(getUrl('operator','USN_FGT'), payload);
  }

  checkPasswordResetRequest(hash: string): Observable<any> {
    const check = { check: { resetHash: hash } };
    return this.http.post<any>(`${getUrl( 'operator','EXIST_CHECK')}/pwd-reset-request`, check);
  }

  createNewPassword(hash: string, payload): Observable<any> {
    return this.http.post(`${getUrl('operator','PWD_RES')}/${hash}`, payload);
  }


}
