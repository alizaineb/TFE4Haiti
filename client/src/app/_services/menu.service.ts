import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private currentUser;
  private menuleft = [
    {name: 'map', logged: false, adminOnly: false, path: 'maps'},
    {name: 'heatmap', logged: false, adminOnly: false, path: 'heatmap'},

    {name: 'stations', logged: true, adminOnly: false, path: 'stations'}


    {name: 'users', logged: false, adminOnly: false, path: 'users'},

  ];

  private menurigh = [

    {name: 'dashboad', logged: true, adminOnly: true, path: 'dashboard'},
    {name: 'login', logged: false, adminOnly: false, path: 'login'},
    {name: 'logout', logged: true, adminOnly: false, path: 'logout'}

  ];

  constructor() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  getMenuLeft() {

    return this.menuleft;

    const self = this;
    const menu = [];
    this.menuleft.forEach(function (value) {
      if (!value.logged) {
        menu.push(value);
      }

      if (self.currentUser) {
        if (value.logged) {
          if (value.adminOnly && self.currentUser.type == 'admin') {
            menu.push(value);
          } else {
            menu.push(value);
          }
        }
      }
    });
    return menu;
  }

  getMenuRight() {

    return this.menurigh;
    const self = this;
    const menu = [];
    this.menurigh.forEach(function (value) {
      if (!value.logged) {
        menu.push(value);
      }

      if (self.currentUser) {
        if (value.logged) {
          if (value.adminOnly && self.currentUser.type == 'admin') {
            menu.push(value);
          } else {
            menu.push(value);
          }
        }
      }
    });
    return menu;
  }
}
