import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IRegistrationCredentials, IRegistrationRequest } from '../../@core/models/credentials.interface';
import { IResource } from '../../@core/models/config.interface';
import { getUrl } from '../../@core/config/endpoints.config';


@Injectable({
  providedIn: 'root',
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  /**
   * @description Registration Request
   * @param {IRegistrationRequest} input
   * @return {Observable<IResource>}
   */
  requestRegistration(input: IRegistrationRequest): Observable<IResource> {
    return this.http.post<IResource>(getUrl('operator', 'REG_REQ'), { input });
  }

  /**
   * @description Check for Registration Request
   * @param {string} hash
   * @return {Observable<IResource>}
   */
  checkRegistrationRequest(hash: string): Observable<IResource> {
    const input = { hash };
    return this.http.post<IResource>(`${getUrl('operator', 'EXIST_CHECK')}/registration-request`, { input });
  }

  /**
   * @description Gets a Registration Request
   * @param {string} hash
   * @return {Observable<IResource>}
   */
  getRegistrationRequest(hash: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('operator', 'REG_REQ_GET')}/${hash}`);
  }

  /**
   * @description Finishes Registration Request and registers a new user
   * @param {string} hash
   * @param {IRegistrationCredentials} input
   * @return {Observable<IResource>}
   */
  registerUser(hash: string, input: IRegistrationCredentials): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('operator', 'REG')}/${hash}`, { input });
  }

}
