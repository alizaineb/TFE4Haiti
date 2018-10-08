import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from "../../_services/user.service";
import { AlertService } from '../../_services/index';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  headers: string[];
  users = [];
  constructor(private userService: UserService, private alertService: AlertService) {
    this.headers = ["Nom", "Prénom", "Adresse mail", "Date de création"];
  }

  ngOnInit() {
    this.loadAwaitingUsers();
  }

  loadAwaitingUsers() {
    let self = this;
    this.userService.getAllAwaiting()
      .pipe(first())
      .subscribe(res => {
        for (let usr of res) {
          //  usr.niceDate = self.toNiceDate(new Date(usr.created_at));
        }
        self.users = res;
      });
  }

  loadAwaitingStation() {

  }

  loadAwaitingData() {

  }

  acceptUser(id: string) {
    this.userService.acceptUser(id)
      .pipe(first())
      .subscribe(result => {
        this.loadAwaitingUsers();
      },
        error => {
          this.alertService.error(error);
        });
  }
  private toNiceDate(date: Date) {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " à " + date.getHours() + ":" + date.getMinutes();
  }
}
