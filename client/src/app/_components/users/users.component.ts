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
      self.users = result;
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
    switch (head) {
      case "Nom":
        break;
      case "Prénom":
        break;
      case "Adresse mail":
        break;
      case "Date de création":
        break;
      case "Date de dernière connexion":
        break;
      case "Role":
        break;
      case "État":
        break;
    }
  }

}
