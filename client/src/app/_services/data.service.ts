import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RainData, RainDataAwaiting } from '../_models/rainData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getAll(stationId): Observable<RainData[]> {
    return this.http.get<RainData[]>(environment.apiUrl + '/rainData/' + stationId);
  }

  getAllRainDataGraphLine(stationId) {
    return this.http.get(environment.apiUrl + '/rainDataGraphLine/' + stationId);
  }

  getAllRainDataGraphLineOneYear(stationId, year) {
    return this.http.get(environment.apiUrl + '/rainDataGraphLineOneYear/' + stationId + '/' + year);
  }

  getAllRainDataGraphLineOneMonth(stationId, month, year) {
    return this.http.get(environment.apiUrl + '/rainDataGraphLineOneMonth/' + stationId + '/' + month + '/' + year);
  }

  updateData(id_station: string, id: string, newData: string) {
    return this.http.post(environment.apiUrl + '/rainData/' + id_station + '/updateData', { id_curr_data: id, data: newData });
  }
  getAllAwaiting() {
    return this.http.get<RainDataAwaiting[]>(environment.apiUrl + '/rainData/awaiting');
  }
  accepteAwaiting(id: string) {
    return this.http.post<RainDataAwaiting[]>(environment.apiUrl + '/rainData/accept/', { id: id });
  }
  refuseAwaiting(id: string) {
    return this.http.delete<RainDataAwaiting[]>(environment.apiUrl + '/rainData/refuse/' + id);
  }



}
