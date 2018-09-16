import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getUrl } from '../../../@core/config/endpoints.config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CredResetService {

  constructor(private http: HttpClient) { }

  // TODO - Interfaces

  requestPasswordReset(payload): Observable<any> {
    return this.http.post(getUrl('PWD_FGT', 'auth'), payload);
  }

  sendUsernameToEmail(payload): Observable<any> {
    return this.http.post(getUrl('USN_FGT', 'auth'), payload);
  }

  checkPasswordResetRequest(hash: string): Observable<any> {
    const check = { check: { resetHash: hash } };
    return this.http.post<any>(`${getUrl('EXIST_CHECK', 'auth')}/pwd-reset-request`, check);
  }

  createNewPassword(hash: string, payload): Observable<any> {
    return this.http.post(`${getUrl('PWD_RES', 'auth')}/${hash}`, payload);
  }


}
