import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { Observable } from "rxjs";


@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<User[]>(environment.apiUrl + '/users');
  }

  getAllAwaiting() {
    return this.http.get<User[]>(environment.apiUrl + '/users/getAllAwaiting');
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/users/' + id);
  }


  getRoles() {
    return this.http.get<string[]>(environment.apiUrl + '/users/roles');
  }

  register(user: User) {
    return this.http.post(environment.apiUrl + '/users', user);
  }

  acceptUser(id: String) {
    return this.http.post(environment.apiUrl + '/users/acceptUser', { id: id });
  }

  refuseUser(id: String, reason: String) {
    return this.http.post(environment.apiUrl + '/users/refuse', { id: id, reason: reason });
  }

  update(user: User) {
    return this.http.put(environment.apiUrl + '/users/' + user._id, user);
  }

  delete(id: number) {
    return this.http.delete(environment.apiUrl + '/users/' + id);
  }

  requestChangePwd(mail: String) {
    return this.http.post(environment.apiUrl + '/users/askResetPwd', { mail: mail });
  }

  changePwd(pwd: String, pwdConf: String, url: String) {
    return this.http.post(environment.apiUrl + '/users/resetPwd', { pwd1: pwd, pwd2: pwdConf, urlReset: url });
  }

}
