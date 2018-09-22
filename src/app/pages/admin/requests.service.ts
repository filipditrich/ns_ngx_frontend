import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IMatch } from "../../@core/models/match.interface";
import { IResponse } from "../../@core/models/response.interface";
import {getUrl} from "../../@core/config/endpoints.config";

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpClient) { }

  getAllRequests() {
    return this.http.get(`${getUrl('operator', 'ALL_REG_REQ')}`)
  }

  requestAprroval(requestBody): Observable<any> {
    return this.http.post<any>(`${getUrl('operator','REG_REQ_APR')}`, requestBody);
  }

}
