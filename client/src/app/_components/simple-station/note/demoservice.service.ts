import { Injectable } from '@angular/core';
import {AlertService} from "../../../_services";
import {NoteService} from "../../../_services/note.service";
import {forkJoin, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DemoserviceService {

  constructor(
    private alertService: AlertService,
    private noteService: NoteService,
  ) {

  }
  public requestDataFromMultipleSources(stationId: string): Observable<any[]> {
    return forkJoin(
      this.noteService.getAll(stationId)
    );
  }
}
