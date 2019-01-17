import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {ILoginResponse, ICredentials, IResource} from '../../@shared/interfaces';
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
   * @return {Observable<IResource>}
   */
  logInRequest(credentials: ICredentials): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('operator', 'LOGIN')}`, credentials);
  }

}
