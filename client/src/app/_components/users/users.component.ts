import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../../_models';
import { UserService } from '../../_services';
import { LocalstorageService } from "../../_services/localstorage.service";
import { AlertService } from '../../_services/index';

@Component({
  templateUrl: 'users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  usersFiltered: User[] = [];

  currentPage = 1; // page courante des utilisateurs affiché


  userToUpdate: User;

  headersUsers: string[];
  searchKeyWord: string = '';

  private map: Map<string, string>;

  constructor(private userService: UserService, private localStorageService: LocalstorageService, private alertService: AlertService) {
    this.currentUser = this.localStorageService.getItem('currentUser').current;
    this.headersUsers = ["Nom", "Prénom", "Adresse mail", "Commune", "Bassin versant", "Date de création", "Date de dernière connexion", "Role", "État"];
  }

  ngOnInit() {
    this.loadAllUsers();
    this.userToUpdate = null;
    this.map = new Map();
    this.map.set("Nom", "first_name");
    this.map.set("Prénom", "last_name");
    this.map.set("Adresse mail", "mail");
    this.map.set("Date de création", "created_at");
    this.map.set("Date de dernière connexion", "last_seen");
    this.map.set("Role", "role");
    this.map.set("État", "state");
    this.map.set('Commune', 'commune');
    this.map.set('Rivière', 'river');
  }

  deleteUser(id) {
    let self = this;
    this.userService.delete(id).pipe(first()).subscribe(result => {
      self.alertService.success("L'utilisteur a été correctement passé dans l'état correspndant");
      this.loadAllUsers();
    },
      error => {
        self.alertService.error(error);
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
      return value.mail.toLowerCase().includes(this.searchKeyWord.toLowerCase());
    });
  }

  assignUserToUpdate(user: User) {
    this.userToUpdate = user;
  }

  sortData(head: string) {
    if (this.usersFiltered.length <= 1) {
      return;
    }
    let key = this.map.get(head);
    let i = 1;
    while (i < this.usersFiltered.length && this.usersFiltered[0][key] == this.usersFiltered[i][key]) {
      i++;
    }
    // Tous les champs sont égaux, pas besoin de trier
    if (i > this.usersFiltered.length || !this.usersFiltered[i]) {
      return;
    }

    if (this.usersFiltered[0][key] <= this.usersFiltered[i][key]) {
      this.usersFiltered.sort((val1: User, val2: User) => {
        if (!val1[key]) {
          val1[key] = "";
        }
        if (!val2[key]) {
          val2[key] = "";
        }
        return val1[key].toLowerCase() > val2[key].toLowerCase() ? -1 : 1
      });
    } else {
      this.usersFiltered.sort((val1: User, val2: User) => {
        if (!val1[key]) {
          val1[key] = "";
        }
        if (!val2[key]) {
          val2[key] = "";
        }
        return val2[key].toLowerCase() > val1[key].toLowerCase() ? -1 : 1
      });
    }
  }
}
