import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService } from '../../_services';
import { LocalstorageService } from "../../_services/localstorage.service";

@Component({
  templateUrl: 'users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  usersFiltered: User[] = [];


  userToUpdate: User;

  headersUsers: string[];
  searchKeyWord: string = '';

  constructor(private userService: UserService, private localStorageService: LocalstorageService) {
    this.currentUser = this.localStorageService.getItem('currentUser').current;
    this.headersUsers = ["Nom", "Prénom", "Adresse mail", "Date de création", "Date de dernière connexion", "Role", "État"];
  }

  ngOnInit() {
    this.loadAllUsers();
    this.userToUpdate = null;
  }

  deleteUser(id: number) {
    this.userService.delete(id).pipe(first()).subscribe(() => {
      this.loadAllUsers()
    });
  }

  private loadAllUsers() {
    let self = this;
    this.userService.getAll().pipe(first()).subscribe(result => {
      self.users = result.slice(0);
      this.usersFiltered = result.slice(0);
      this.filterUser();
    });
  }

  filterUser() {
    this.usersFiltered = this.users.filter((value) => {
      return value.first_name.toLowerCase().includes(this.searchKeyWord.toLowerCase());
    });
  }

  assignUserToUpdate(user: User) {
    this.userToUpdate = user;
  }

  sortData(head: string) {
    if (this.usersFiltered.length <= 1) {
      return;
    }
    let map = new Map();
    map.set("Nom", "first_name");
    map.set("Prénom", "last_name");
    map.set("Adresse mail", "mail");
    map.set("Date de création", "created_at");
    map.set("Date de dernière connexion", "last_seen");
    map.set("Role", "role");
    map.set("État", "state");
    let key = map.get(head);
    let i = 1;
    while (i < this.usersFiltered.length && this.usersFiltered[0][key] == this.usersFiltered[i][key]) {
      i++;
    }
    // Tous les champs sont égaux, pas besoin de trier
    if (i > this.usersFiltered.length) {
      return;
    }
    if (this.usersFiltered[0][key] <= this.usersFiltered[i][key]) {
      this.usersFiltered.sort((val1: User, val2: User) => { return val1[key].toLowerCase() > val2[key].toLowerCase() ? -1 : 1 });
    } else {
      this.usersFiltered.sort((val1: User, val2: User) => { return val2[key].toLowerCase() > val1[key].toLowerCase() ? -1 : 1 });
    }
  }
}
