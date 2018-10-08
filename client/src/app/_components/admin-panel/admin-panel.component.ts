import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { UserService } from "../../_services/user.service";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  headers: string[];
  constructor(private userService: UserService) {
    this.headers = ["Nom", "Prénom", "Adresse mail", "Date de création"];
  }

  ngOnInit() {
    this.loadAwaitingUsers();
  }

  loadAwaitingUsers() {
    this.userService.getAllAwaiting()
      .pipe(first())
      .subscribe(res => {
        for (let usr of res) {
          usr.niceDate = this.toNiceDate(new Date(usr.created_at));
        }
        this.users = res;
      });
  }

  loadAwaitingStation() {

  }

  loadAwaitingData() {

  }

  toNiceDate(date: Date) {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " à " + date.getHours() + ":" + date.getMinutes();
  }
}
