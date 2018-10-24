import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {Note, Station} from '../_models';
import {Observable} from 'rxjs';
import {Data} from "../_models/data";

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  constructor(private http: HttpClient) {
  }

  getIntervals() {
    return this.http.get<any[]>(environment.apiUrl + '/stations/getInfo/intervals');
  }

  getCommunes() {
    return this.http.get<any[]>(environment.apiUrl + '/stations/getInfo/communes');
  }

  getRivers() {
    return this.http.get<any[]>(environment.apiUrl + '/stations/getInfo/rivers');
  }

  getAll() {
    return this.http.get<Station[]>(environment.apiUrl + '/stations');
  }

  getById(id: string): Observable <Station> {
    return this.http.get<Station>(environment.apiUrl + '/stations/' + id);
  }

  register(station: Station) {
    return this.http.post<Station>(environment.apiUrl + '/stations', station);
  }

  update(station) {
    return this.http.put(environment.apiUrl + '/stations/' + station._id, station);
  }

  delete(id: string) {
    return this.http.delete(environment.apiUrl + '/stations/' + id);
  }

  getAllAwaiting() {
    return this.http.get<Station[]>(environment.apiUrl + '/stations/getAllAwaiting');
  }




  /*
  acceptUser(id: String) {
    return this.http.post(environment.apiUrl + '/users/acceptUser', { id: id });
  }
  */
  acceptStation(id: String) {
    return this.http.post(environment.apiUrl + '/stations/acceptStation', { id: id });
  }

  getFrenchState(station: Station) {
    const french = {
      'working' : 'Ok',
      'awaiting' : 'A valider',
      'broken' : 'En panne',
      'deleted' : 'Supprimée'
    };
    return french[station.state];

  }

  importData(id:string, dataToSend: Data[]) {
    return this.http.post(`${environment.apiUrl}/stations/${id}/import`, dataToSend);
  }
}
