import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models';

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

  getById(id: number) {
    return this.http.get(environment.apiUrl + '/users/' + id);
  }

  register(user: User) {
    return this.http.post(environment.apiUrl + '/users', user);
  }

  acceptUser(id: String) {
    return this.http.post(environment.apiUrl + '/users/acceptUser', { id: id });
  }

  refuseUser(id: String) {
    return this.http.post(environment.apiUrl + '/users/refuse', {id: id});
  }

  update(user: User) {
    return this.http.put(environment.apiUrl + '/users/' + user._id, user);
  }

  delete(id: number) {
    return this.http.delete(environment.apiUrl + '/users/' + id);
  }


}
