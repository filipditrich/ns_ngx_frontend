import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { getUrl } from "../../../@core/config/endpoints.config";
import { IRegistrationCredentials, IRegistrationRequest } from "../../../@core/models/credentials.interface";


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  requestRegistration(credentials: IRegistrationRequest): Observable<any> {
    return this.http.post<any>(getUrl('REG_REQ', 'auth'), credentials);
  }

  checkRegistrationRequest(hash: string): Observable<any> {
    const check = { check: { 'registration.registrationHash': hash } };
    return this.http.post<any>(`${getUrl('EXIST_CHECK', 'auth')}/registration-request`, check);
  }

  getRegistrationRequest(hash: string): Observable<any> {
    return this.http.get<any>(`${getUrl('REQ_REQ_GET', 'auth')}/${hash}`);
  }

  registerUser(hash: string, credentials: IRegistrationCredentials): Observable<any> {
    return this.http.post<any>(`${getUrl('REG', 'auth')}/${hash}`, credentials);
  }
}
