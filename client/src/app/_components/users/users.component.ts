import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';

import {User} from '../../_models/index';
import {UserService} from '../../_services/index';

@Component({templateUrl: 'users.component.html'})
export class UsersComponent implements OnInit {
  currentUser: User;
  users: User[] = [];

  constructor(private userService: UserService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')).current;
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
    this.userService.getAll().pipe(first()).subscribe(result => {
      this.users = result;
    });
  }
}
