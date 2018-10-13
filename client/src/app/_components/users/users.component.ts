import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import { LocalstorageService } from "../../_services/localstorage.service";

@Component({
  templateUrl: 'users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentUser: User;
  users: User[] = [];

  headersUsers: string[];

  constructor(private userService: UserService, private localStorageService: LocalstorageService) {
    this.currentUser = this.localStorageService.getItem('currentUser').current;
    this.headersUsers = ["Nom", "Prénom", "Adresse mail", "Date de création", "Date de dernière connexion", "Role", "État"];
  }

  ngOnInit() {
    this.loadAllUsers();
  }

  deleteUser(id: number) {
    this.userService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllUsers()
    });
  }

  private loadAllUsers() {
    let self = this;
    this.userService.getAll().pipe(first()).subscribe(result => {
      for (let usr of result) {
        usr.niceDateCreatedAt = self.toNiceDate(new Date(usr.created_at));
        usr.niceDateLastCo = self.toNiceDate(new Date(usr.last_seen));
      }
      self.users = result;
    });
  }

  filterUser(event) {
    console.log("TODO");
  }
}

    this.userService.getAll().pipe(first()).subscribe(result => {