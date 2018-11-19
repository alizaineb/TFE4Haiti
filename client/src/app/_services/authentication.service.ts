import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { LocalstorageService } from "./localstorage.service";
import {Constantes} from "../_helpers/constantes";

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private localStorageService: LocalstorageService) {
  }

  login(username: string, password: string) {
    return this.http.post<any>(environment.apiUrl + '/users/login', { mail: username, pwd: password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // localStorage.setItem('currentUser', JSON.stringify(user));
          this.localStorageService.setItem("currentUser", user);
        }
        return user;
      }));
  }

  isLogged() {
    return this.http.get<any>(environment.apiUrl + '/login/test');
  }

  logout() {
    // remove user from local storage to log user out
    this.localStorageService.removeItem('currentUser');
  }

  register(first_name: string, last_name: string, username: string, role: string, commune: string, bassin_versant: string) {
    return this.http.post<any>(environment.apiUrl + '/users', {
      first_name: first_name,
      last_name: last_name,
      mail: username,
      role: role,
      commune: commune,
      bassin_versant: bassin_versant
    })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.localStorageService.setItem('currentUser', user);

        }

        return user;
      }));
  }

  resetPwd(pwd: String, confirmPwd: String) {
    //TODO change url and param
    return this.http.post<any>(environment.apiUrl + '/users', {})
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.localStorageService.setItem('currentUser', user);
        }

        return user;
      }));
  }

  hasAdminAccess(){
    const user = this.localStorageService.getItem('currentUser');
    if(user && user.current){
      return user.current.role == Constantes.roles.ADMIN;
    }else{
      return false;
    }
  }

  hasWorkerAccess(){
    const user = this.localStorageService.getItem('currentUser');
    if(user && user.current){
      return user.current.role == Constantes.roles.WORKER || this.hasAdminAccess();
    }else{
      return false;
    }

  }

  hasViewerAccess(){
    const user = this.localStorageService.getItem('currentUser');
    if(user && user.current){
      return user.role == Constantes.roles.VIEWER || this.hasWorkerAccess();
    }else{
      return false;
    }

  }
}
