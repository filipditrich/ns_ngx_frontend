import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IMatch } from '../../../@core/models/match.interface';
import { IResource } from '../../../@core/models/config.interface';
import { getUrl } from '../../../@core/config/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class MatchesService {

  constructor(private http: HttpClient) { }

  /**
   * @description Request for Match creation
   * @param {IMatch} input
   * @param {boolean} force
   * @return {Observable<IResource>}
   */
  create(input: IMatch, force?: boolean): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('core', 'ADD_MATCH')}${force ? '?force-create=true' : ''}`, { input });
  }

  /**
   * @description Request for Match obtain
   * @param {string} id
   * @return {Observable<IResource>}
   */
  get(id?: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_MATCH')}/${!!id ? id : ''}`);
  }

  /**
   * @description Request for Match update
   * @param {string} id
   * @param {IMatch} input
   * @return {Observable<IResource>}
   */
  update(id: string, input: any): Observable<IResource> {
    return this.http.put<IResource>(`${getUrl('core', 'UPD_MATCH')}/${id}`, { input });
  }

  /**
   * @description Request for Match delete
   * @param {string} id
   * @return {Observable<IResource>}
   */
  delete(id: string): Observable<IResource> {
    return this.http.delete<IResource>(`${getUrl('core', 'DEL_MATCH')}/${id}`);
  }

  /**
   * @description Request for Player Match enrollment
   * @param {string} id
   * @param enrollment
   * @return {Observable<IResource>}
   */
  enrollSelf(id: string, enrollment: any): Observable<IResource> {
    const input = { id, enrollment };
    return this.http.post<IResource>(`${getUrl('core', 'MATCH_ENROLLMENT')}`, { input });
  }


  writeResults(input: any): Observable<IResource> {
    return this.http.post<IResource>(getUrl('core', 'WRITE_MATCH_RESULTS'), { input });
  }

}
