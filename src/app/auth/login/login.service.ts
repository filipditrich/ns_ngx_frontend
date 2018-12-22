import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ILoginResponse, ICredentials } from '../../@shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { getUrl } from '../../@shared/config/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient) { }

  /**
   * @description Login
   * @param {ICredentials} credentials
   * @return {Observable<ILoginResponse>}
   */
  logInRequest(credentials: ICredentials): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${getUrl('operator', 'LOGIN')}`, credentials);
  }

}
