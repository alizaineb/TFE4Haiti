import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Station} from "../_models";

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  constructor(private http: HttpClient) {
  }

  getIntervals(){
    return this.http.get<any[]>(environment.apiUrl + '/stations/getInfo/intervals')
  }

  getAll() {
    return this.http.get<Station[]>(environment.apiUrl + '/stations');
  }

  getById(id: string) {
    return this.http.get(environment.apiUrl + '/stations/' + id);
  }

  register(station: Station) {
    return this.http.post(environment.apiUrl + '/stations', JSON.stringify({station}));
  }

  update(station) {
    return this.http.put(environment.apiUrl + '/stations/' + station._id, station);
  }

  delete(id: string) {
    return this.http.delete(environment.apiUrl + '/stations/' + id);
  }
}
