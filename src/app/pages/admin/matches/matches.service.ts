import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IMatch } from '../../../@shared/interfaces/match.interface';
import { IResource } from '../../../@shared/interfaces/config.interface';
import { getUrl } from '../../../@shared/config/endpoints.config';

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
   * @description Request to obtain Match(es)
   * @param {string} id
   * @return {Observable<IResource>}
   */
  get(id?: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_MATCH')}/${!!id ? id : ''}`);
  }

  /**
   * @description Request to obtain Match(es) by its Group
   * @param {string} group
   * @return {Observable<IResource>}
   */
  getByGroup(group: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_MATCH_BY_GROUP')}/${group}`);
  }

  /**
   * @description Request to obtain Match(es) by its Group name
   * @param {string} groupName
   * @return {Observable<IResource>}
   */
  getByGroupName(groupName: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_MATCH_BY_GROUP_NAME')}/${groupName}`);
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

  /**
   * @description Request for Match Result write
   * @param input
   * @param {string} id
   * @return {Observable<IResource>}
   */
  writeResults(input: any, id?: string): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('core', 'WRITE_MATCH_RESULTS')}/${!!id ? id : ''}`, { input });
  }

}
