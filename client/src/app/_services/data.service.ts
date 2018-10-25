import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Data} from "../_models/data";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  getAll(stationId): Observable <Data[]> {
    return this.http.get<Data[]>(environment.apiUrl + '/data/' + stationId);
  }

}
