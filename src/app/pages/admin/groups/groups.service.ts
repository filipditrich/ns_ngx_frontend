import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { getUrl } from '../../../@shared/config/endpoints.config';
import { IGroup } from '../../../@shared/interfaces/group.interface';
import { IResource } from '../../../@shared/interfaces/config.interface';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {

  constructor(private http: HttpClient) { }

  /**
   * @description Request for Group creation
   * @param input
   * @return {Observable<IResource>}
   */
  create(input: IGroup): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('core', 'ADD_GROUP')}`, { input });
  }

  /**
   * @description Request for Group update
   * @param {string} id
   * @param {any} input
   * @return {Observable<IResource>}
   */
  update(id: string, input: any): Observable<IResource> {
    return this.http.put<IResource>(`${getUrl('core', 'UPD_GROUP')}/${id}`, { input } );
  }

  /**
   * @description Request for Group delete
   * @param {string} id
   * @return {Observable<IResource>}
   */
  delete(id: string): Observable<IResource> {
    return this.http.delete<IResource>(`${getUrl('core', 'DEL_GROUP')}/${id}`);
  }

  /**
   * @description Request for Group obtain
   * @param {string} id
   * @return {Observable<IResource>}
   */
  get(id?: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_GROUP')}/${!!id ? id : ''}`);
  }

  /**
   * @description Request to obtain Group by name
   * @param {string} name
   * @return {Observable<IResource>}
   */
  getByName(name: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_GROUP_BY_NAME')}/${name}`);
  }

}
