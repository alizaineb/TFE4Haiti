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
  constructor(private userService: UserService, private stationsService: StationsService, private alertService: AlertService) {
    this.headersUsers = ["Nom", "Prénom", "Adresse mail", "Date de création"];
    this.headersStation = ["Nom de la station", "Coordonnées", "Intervalle", "Auteur ", "Date de mise en service"];
    this.showUsers = false;
    this.showStations = false;
    this.showDatas = false;
  }

  ngOnInit() {
    this.loadAwaitingUsers();
    this.loadAwaitingStation();
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
    station.isDisabled = true;
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
}
