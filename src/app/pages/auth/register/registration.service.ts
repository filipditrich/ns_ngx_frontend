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
    return this.http.post<any>('http://localhost:4000/api/auth/registration-request', credentials);
  }

  checkRegistrationRequest(hash: string): Observable<any> {
    const postBody = {hash: hash};
    return this.http.post<any>(`${getUrl('operator','EXIST_CHECK')}`, postBody);
  }

  getRegistrationRequest(hash: string): Observable<any> {
    return this.http.get<any>(`${getUrl('operator', 'REG_REQ_GET')}/${hash}`);
  }

  registerUser(hash: string, credentials: IRegistrationCredentials): Observable<any> {
    return this.http.post<any>(`${getUrl('operator', 'REG')}/${hash}`, credentials);
    console.log(getUrl('operator', 'REG'))
  }
}
