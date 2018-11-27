import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Note, Station } from '../_models';
import { Observable } from 'rxjs';
import { RainData } from "../_models/rainData";
import { LocalstorageService } from "./localstorage.service";
import { Constantes } from "../_helpers/constantes";

@Injectable({
  providedIn: 'root'
})
export class StationsService {
  constructor(private http: HttpClient, private localStorageService: LocalstorageService) {
  }

  getIntervals() {
    return this.http.get<any[]>(environment.apiUrl + '/stations/getInfo/intervals');
  }

  getCommunes() {
    return this.http.get<any[]>(environment.apiUrl + '/stations/getInfo/communes');
  }

  getBassin_versants() {
    return this.http.get<any[]>(environment.apiUrl + '/stations/getInfo/bassin_versants');
  }

  getAll() {
    return this.http.get<Station[]>(environment.apiUrl + '/stations');
  }

  getById(id: string): Observable<Station> {
    return this.http.get<Station>(environment.apiUrl + '/stations/' + id);
  }

  register(station: Station) {
    return this.http.post<Station>(environment.apiUrl + '/stations', station);
  }

  update(station) {
    return this.http.put(environment.apiUrl + '/stations/' + station._id, station);
  }

  addUser(stationId: string, userId: string) {
    return this.http.put(environment.apiUrl + '/stations/addUser/' + stationId, { user_id: userId });
  }

  removeUser(stationId: string, userId: string) {
    return this.http.put(environment.apiUrl + '/stations/removeUser/' + stationId, { user_id: userId });
  }

  delete(id: string) {
    return this.http.delete(environment.apiUrl + '/stations/' + id);
  }

  getAllAwaiting() {
    return this.http.get<Station[]>(environment.apiUrl + '/stations/getAllAwaiting');
  }


  getData(id_station: string, date: string) {
    return this.http.get<RainData[]>(environment.apiUrl + '/data/' + id_station + '/' + date);
  }

  getStats() {
    return this.http.get<{ total: number, awaiting: number, broken: number, working: number, deleted: number }>(environment.apiUrl + '/station/stats');
  }

  hasAccessToStation(station: Station) {
    let user = this.localStorageService.getItem('currentUser');
    if (!user || !user.current) {
      return false;
    }
    user = user.current
    // Si l'utilisateur est un admin il peut passer
    if (user.role == Constantes.roles.ADMIN) {
      return true;
    }
    // On a la station et l'utilisateur
    // Il y a 3 checks à faire
    // Commune :
    if (user.commune === station.commune) {
      return true;
    }
    // Rivière :
    if (user.bassin_versant === station.bassin_versant) {
      return true;
    }
    // assignée
    if (station.users && station.users.indexOf(user._id) > -1) {
      return true;
    }

    return false;
  }





  /*
  acceptUser(id: String) {
    return this.http.post(environment.apiUrl + '/users/acceptUser', { id: id });
  }
  */
  acceptStation(id: String) {
    return this.http.post(environment.apiUrl + '/stations/acceptStation', { station_id: id });
  }

  getFrenchState(station: Station) {
    const french = {
      'working': 'Ok',
      'awaiting': 'A valider',
      'broken': 'En panne',
      'deleted': 'Supprimée'
    };
    return french[station.state];

  }

  importData(id: string, dataToSend: RainData[]) {
    return this.http.post(`${environment.apiUrl}/stations/${id}/import`, dataToSend);
  }

  importDataFile(id: string, file: FormData) {
    return this.http.post(`${environment.apiUrl}/stations/${id}/importFile`, file);
  }

  downloadData(id: string, param) {
    return this.http.get(environment.apiUrl + '/stations/' + id + '/download', { params: param });
  }

}
