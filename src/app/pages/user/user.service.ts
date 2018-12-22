import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { getUrl } from '../../@shared/config/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) { }

  getCurrentUser(attr?: string) {
    return !!attr ? JSON.parse(sessionStorage.getItem('user'))[attr] : JSON.parse(sessionStorage.getItem('user')) || false;
  }

  // TODO - Observable<Interface>
  getUser(id): Observable<any> {
    return this.http.get(`${getUrl('operator', 'GET_USER')}/${id}`);
  }

  // TODO - Observable<Interface>
  getAllUsers(): Observable<any> {
    return this.http.get(`${getUrl('operator', 'GET_USER')}`);
  }

}
