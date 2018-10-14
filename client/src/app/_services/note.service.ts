import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {Note} from "../_models";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) {}

  getAll(stationId): Observable <Note[]> {
    return this.http.get<Note[]>(environment.apiUrl + '/notes/' + stationId);
  }

  register(note: Note) {
    return this.http.post<Note>(environment.apiUrl + '/notes/', note);
  }
}
