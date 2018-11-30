import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IResource } from '../../../@core/models/config.interface';
import { getUrl } from '../../../@core/config/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class RegistrationRequestsService {

  constructor(private http: HttpClient) { }

  /**
   * @description Request for Registration Request obtain
   * @param {string} id
   * @return {Observable<IResource>}
   */
  get(id?: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('operator', 'GET_REG_REQ')}/${!!id ? id : ''}`);
  }


  /**
   * @description Request for Registraiton Request approval resolve
   * @param {string} id
   * @param {boolean} state
   * @return {Observable<IResource>}
   */
  resolveRequest(id: string, state: boolean): Observable<IResource> {
    const input = { id, state };
    return this.http.post<IResource>(`${getUrl('operator', 'REG_REQ_APR')}`, { input });
  }

  /**
   * @description Sends email invitations to all recipients in emailList
   * @param {string[]} input
   * @return {Observable<IResource>}
   */
  sendInvites(input: string[]): Observable<IResource> {
    return this.http.post<IResource>(getUrl('operator', 'SEND_INVITES'), { input });
  }


}
