import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {RainData} from "../_models/rainData";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getAll(stationId): Observable <RainData[]> {
    return this.http.get<RainData[]>(environment.apiUrl + '/data/' + stationId);
  }

}
