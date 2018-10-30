import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RainData } from '../_models/rainData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getAll(stationId): Observable<RainData[]> {
    return this.http.get<RainData[]>(environment.apiUrl + '/rainData/' + stationId);
  }

  getAllRainDataGraphLine(stationId): Observable<RainData[]> {
    return this.http.get<RainData[]>(environment.apiUrl + '/rainDataGraphLine/' + stationId);
  }

  getAllRainDataGraphLineMonthly(stationId, year): Observable<RainData[]> {
    return this.http.get<RainData[]>(environment.apiUrl + '/rainDataGraphLineMonthly/' + stationId + '/' + year);
  }

  updateData(id: string, newData: string) {
    return this.http.post(environment.apiUrl + '/rainData/updateData', { id_curr_data: id, data: newData });
  }
  getAllAwaiting(){
    return this.http.get<RainData[]>(environment.apiUrl + '/rainData/awaiting');
  }



}
