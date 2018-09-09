import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { IMatch } from "../../@core/models/match.interface";
import { IResponse } from "../../@core/models/response.interface";

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  constructor(private http: HttpClient) { }

  addMatchRequest(matches: IMatch): Observable<IResponse> {
    return this.http.post<IResponse>('http://localhost:4000/api/core/matches', matches);
  }

  getAllMatchesRequest(): Observable<IResponse> {
    return this.http.post<IResponse>('http://localhost:4000/api/core/matches/get-all', {})
  }

  participationInMatchRequest(requestBody): Observable<IResponse> {
    return this.http.post<IResponse>('http://localhost:4000/api/core/matches/participation', requestBody)
  }


  writeMatchResultsRequest(input): Observable<IResponse> {
    return this.http.post<IResponse>('http://localhost:4000/api/core/matches/write-results', input)
  }

}
