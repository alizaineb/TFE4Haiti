import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from "../../_services/user.service";
import { Station } from "../../_models";
import { StationsService } from "../../_services/stations.service";
import { AlertService } from '../../_services/index';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  currUser: string;
  showUsers: boolean;
  showStations: boolean;
  showDatas: boolean;

  headersUsers: string[];
  headersStation: string[];
  users = [];
  stations = [];
  private map: Map<string, string>;
  constructor(private userService: UserService, private stationsService: StationsService, private alertService: AlertService) {
    this.headersUsers = ["Nom", "Prénom", "Adresse mail", "Date de création"];
    this.headersStation = ["Nom de la station", "Latitude", "Longitude", "Intervalle", "Auteur ", "Date de mise en service"];
    this.showUsers = false;
    this.showStations = false;
    this.showDatas = false;
  }

  ngOnInit() {
    this.loadAwaitingUsers();
    this.loadAwaitingStation();
    this.map = new Map();
    this.map.set("Nom de la station", "name");
    this.map.set("Latitude", "latitude");
    this.map.set("Longitude", "latitude");
    this.map.set("Intervalle", "interval");
    this.map.set("Auteur", "user_creator_id");
    this.map.set("Date de mise en service", "createdAt");
  }

  loadAwaitingUsers() {
    let self = this;
    this.userService.getAllAwaiting()
      .pipe(first())
      .subscribe(res => {
        self.users = res;
        if (res.length > 0) {
          this.showUsers = true;
        } else {
          this.showUsers = false;
        }
      });
  }

  loadAwaitingStation() {
    let self = this;
    this.stationsService.getAllAwaiting()
      .pipe(first())
      .subscribe(res => {
        self.stations = res;
        console.log(res);
        if (res.length > 0) {
          this.showStations = true;
        } else {
          this.showStations = false;
        }
      });
  }

  loadAwaitingData() {
    this.showDatas = false;
  }

  setCurrUser(id: string) {
    this.currUser = id;
  }

  acceptUser(id: string) {
    let self = this;
    this.userService.acceptUser(id)
      .pipe(first())
      .subscribe(result => {
        self.loadAwaitingUsers();
        self.alertService.success("L'utilisateur a été accepté avec succès");
      },
        error => {
          self.alertService.error(error);
        });
  }

  acceptStation(station: Station) {
    let self = this;
    this.stationsService.acceptStation(station._id)
      .pipe(first())
      .subscribe(result => {
        self.loadAwaitingStation();
        self.alertService.success("La station a été accepté avec succès");
      },
        error => {
          self.alertService.error(error);
        });
  }


  sortDataStation(head: string) {
    if (this.stations.length <= 1) {
      return;
    }
    // TODO gérer intervalle sort propre
    let key = this.map.get(head);
    let i = 1;
    while (i < this.stations.length && this.stations[0][key] == this.stations[i][key]) {
      i++;
    }
    // Tous les champs sont égaux, pas besoin de trier
    if (i > this.stations.length) {
      return;
    }

    if (this.stations[0][key] <= this.stations[i][key]) {
      this.stations.sort((val1: Station, val2: Station) => {
        if (typeof (val1[key]) == 'number') {
          return val1[key] > val2[key] ? -1 : 1
        }
        return val1[key].toLowerCase() > val2[key].toLowerCase() ? -1 : 1
      });
    } else {
      this.stations.sort((val1: Station, val2: Station) => {
        if (typeof (val1[key]) == 'number') {
          return val2[key] > val1[key] ? -1 : 1
        }
        return val2[key].toLowerCase() > val1[key].toLowerCase() ? -1 : 1
      });
    }
  }

}
