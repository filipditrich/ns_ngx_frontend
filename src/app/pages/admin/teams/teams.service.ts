import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { getUrl } from '../../../@core/config/endpoints.config';
import { ITeam } from '../../../@core/models/team.interface';
import { IResource } from '../../../@core/models/config.interface';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {

  constructor(private http: HttpClient) { }

  /**
   * @description Request for Team creation
   * @param input
   * @return {Observable<IResource>}
   */
  create(input: ITeam): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('core', 'ADD_TEAM')}`, { input });
  }

  /**
   * @description Request for Team update
   * @param {string} id
   * @param {any} input
   * @return {Observable<IResource>}
   */
  update(id: string, input: any): Observable<IResource> {
    return this.http.put<IResource>(`${getUrl('core', 'UPD_TEAM')}/${id}`, { input } );
  }

  /**
   * @description Request for Team delete
   * @param {string} id
   * @return {Observable<IResource>}
   */
  delete(id: string): Observable<IResource> {
    return this.http.delete<IResource>(`${getUrl('core', 'DEL_TEAM')}/${id}`);
  }

  /**
   * @description Request for Team obtain
   * @param {string} id
   * @return {Observable<IResource>}
   */
  get(id?: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_TEAM')}/${!!id ? id : ''}`);
  }

}
