import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IPlace } from '../../../@shared/interfaces/place.interface';
import { getUrl } from '../../../@shared/config/endpoints.config';
import { IResource } from '../../../@shared/interfaces/config.interface';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  constructor(private http: HttpClient) { }

  /**
   * @description Request for Place creation
   * @param input
   * @return {Observable<IResource>}
   */
  create(input: IPlace): Observable<IResource> {
    return this.http.post<IResource>(`${getUrl('core', 'ADD_PLACE')}`, { input });
  }

  /**
   * @description Request for Place update
   * @param {string} id
   * @param {any} input
   * @return {Observable<IResource>}
   */
  update(id: string, input: any): Observable<IResource> {
    return this.http.put<IResource>(`${getUrl('core', 'UPD_PLACE')}/${id}`, { input } );
  }

  /**
   * @description Request for Place delete
   * @param {string} id
   * @return {Observable<IResource>}
   */
  delete(id: string): Observable<IResource> {
    return this.http.delete<IResource>(`${getUrl('core', 'DEL_PLACE')}/${id}`);
  }

  /**
   * @description Request for Place obtain
   * @param {string} id
   * @return {Observable<IResource>}
   */
  get(id?: string): Observable<IResource> {
    return this.http.get<IResource>(`${getUrl('core', 'GET_PLACE')}/${!!id ? id : ''}`);
  }

}
