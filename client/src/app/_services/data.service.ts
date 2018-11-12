import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RainData, RainDataAwaiting } from '../_models/rainData';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
  }

  getAll(stationId): Observable<RainData[]> {
    return this.http.get<RainData[]>(environment.apiUrl + '/rainData/' + stationId);
  }

  getAllRainDataGraphLine(stationId) {
    return this.http.get(environment.apiUrl + '/rainDataGraphLine/' + stationId);
  }

  getAllRainDataGraphLineOneYear(stationId, year): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + '/rainDataGraphLineOneYear/' + stationId + '/' + year);
  }

  getAllRainDataGraphLineOneMonth(stationId, month, year): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + '/rainDataGraphLineOneMonth/' + stationId + '/' + month + '/' + year);
  }

  getAllRainDataGraphLineRangeDate(stationId, minDate, minMonth, minYear, maxDate, maxMonth, maxYear): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + '/rainDataGraphLineRangeDate/' + stationId + '/' + minDate + '/' + minMonth + '/' + minYear + '/' + maxDate + '/' + maxMonth + '/' + maxYear);
  }

  updateData(id_station: string, id: string, newData: string, date: Date) {
    return this.http.post(environment.apiUrl + '/rainData/' + id_station + '/updateData', {
      id_curr_data: id,
      data: newData,
      date: date
    });
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

  getDataForMonth(id_station: string, year: string, month: string) {
    return this.http.get<RainData[]>(environment.apiUrl + `/data/${id_station}/${year}/${month}`);
  }

}
