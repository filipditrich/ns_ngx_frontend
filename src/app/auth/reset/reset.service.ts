import { Injectable } from '@angular/core';
import { IResource } from '../../@core/models/config.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICredentialReset } from '../../@core/models/credentials.interface';
import { getUrl } from '../../@core/config/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class CredResetService {

  constructor(private http: HttpClient) { }

  /**
   * @description Password reset request
   * @param {ICredentialReset} input
   * @return {Observable<IResource>}
   */
  requestPasswordReset(input: ICredentialReset): Observable<IResource> {
    return this.http.post<IResource>(getUrl( 'operator', 'PWD_FGT'), { input });
  }

  /**
   * @description Username reset request
   * @param {ICredentialReset} input
   * @return {Observable<IResource>}
   */
  sendUsernameToEmail(input: ICredentialReset): Observable<IResource> {
    return this.http.post<IResource>(getUrl('operator', 'USN_FGT'), { input });
  }

  /**
   * @description Password Reset Request check
   * @param {string} hash
   * @return {Observable<IResource>}
   */
  checkPasswordResetRequest(hash: string): Observable<IResource> {
    const input = { hash: hash };
    return this.http.post<IResource>(`${getUrl( 'operator', 'EXIST_CHECK')}/password-reset`, { input });
  }

  /**
   * @description Password reset
   * @param {string} hash
   * @param {{password: string}} input
   * @return {Observable<IResource>}
   */
  createNewPassword(hash: string, input: { password: string }): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('operator', 'PWD_RES')}/${hash}`, { input });
  }

}
