import {Component, Input, OnInit} from '@angular/core';
import {StationsService} from "../../_services/stations.service";
import {AlertService, UserService} from "../../_services";
import {NoteService} from "../../_services/note.service";
import {Note, User} from "../../_models";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input()
  private stationId: string;

  notes: Note[] = [];
  mapUsers;

  constructor(
    private stationService: StationsService,
    private alertService: AlertService,
    private noteService: NoteService,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    this.mapUsers = new Map();
    this.loadData();
  }

  loadData(){
    let self = this;
    this.noteService.getAll(this.stationId)
      .pipe(first())
      .subscribe(result => {
        this.notes = result;
        for (let n of this.notes){
          this.userService.getById(n.user_id)
            .pipe(first())
            .subscribe(result => {
              console.log(result);
              self.mapUsers.set(n.user_id,result);
            });
        }
      });
  }
}
