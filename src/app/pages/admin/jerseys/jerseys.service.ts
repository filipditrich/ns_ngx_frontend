import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IJersey } from '../../../@shared/interfaces/jersey.interface';
import { IResource } from '../../../@shared/interfaces/config.interface';
import { getUrl } from '../../../@shared/config/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class JerseysService {

  constructor(private http: HttpClient) { }

  /**
   * @description Request for Jersey creation
   * @param input
   * @return {Observable<IResource>}
   */
  create(input: IJersey): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('core', 'ADD_JERSEY')}`, { input });
  }

  /**
   * @description Request for Jersey update
   * @param {string} id
   * @param {any} input
   * @return {Observable<IResource>}
   */
  update(id: string, input: any): Observable<IResource> {
    return this.http.put<IResource>(`${getUrl('core', 'UPD_JERSEY')}/${id}`, { input } );
  }

  /**
   * @description Request for Jersey delete
   * @param {string} id
   * @return {Observable<IResource>}
   */
  delete(id: string): Observable<IResource> {
    return this.http.delete<IResource>(`${getUrl('core', 'DEL_JERSEY')}/${id}`);
  }

  /**
   * @description Request for Jersey obtain
   * @param {string} id
   * @return {Observable<IResource>}
   */
  get(id?: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_JERSEY')}/${!!id ? id : ''}`);
  }

}
