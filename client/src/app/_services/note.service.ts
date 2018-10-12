import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Note} from "../_models";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Note[]>(environment.apiUrl + '/notes/');
  }

  register(note: Note) {
    return this.http.post(environment.apiUrl + '/notes/', note);
  }
}
