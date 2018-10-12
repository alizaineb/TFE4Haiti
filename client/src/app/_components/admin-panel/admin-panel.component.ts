import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from "../../_services/user.service";
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

  headers: string[];
  users = [];
  constructor(private userService: UserService, private stationsService: StationsService, private alertService: AlertService) {
    this.headers = ["Nom", "Prénom", "Adresse mail", "Date de création"];
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
        for (let usr of res) {
          usr.niceDate = self.toNiceDate(new Date(usr.created_at));
        }
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
        console.table(res);/*
        for (let station of res) {
          station.niceDate = self.toNiceDate(new Date(station.created_at));
        }
        self.users = res;
        if (res.length > 0) {
          this.showUsers = true;
        } else {
          this.showUsers = false;
        }*/
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

  private toNiceDate(date: Date) {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " à " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  }
}
