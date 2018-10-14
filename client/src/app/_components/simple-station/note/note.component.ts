import { Component, Input, OnInit } from '@angular/core';
import { StationsService } from "../../../_services/stations.service";
import { AlertService, UserService } from "../../../_services/";
import { NoteService } from "../../../_services/note.service";
import { Note, User } from "../../../_models/";
import { first } from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  @Input()
  private stationId: string;

  addNoteForm: FormGroup;

  notes: Note[] = [];
  isLoaded: boolean;

  submitted = false;


  constructor(
    private stationService: StationsService,
    private alertService: AlertService,
    private noteService: NoteService,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    this.isLoaded = false;
    this.loadData();
    this.addNoteForm = new FormGroup({
      'note': new FormControl('',[
        Validators.required,
        Validators.maxLength(200)
      ])
    })
  }

  get note() { return this.addNoteForm.get('note'); }


  onSubmit() { this.submitted = true; }


  loadData() {
    let self = this;
    this.noteService.getAll(this.stationId)
      .pipe(first())
      .subscribe(result => {
        this.notes = result;
        let i = 0;
        // this.userService.getAll().subscribe(users =>  {
        //   for (let n of this.notes)  {
        //     for( let u of users){
        //       if (n.user_id == u._id){
        //         n.user = u;
        //       }
        //     }
        //   }
        //   self.done();
        // });

        for (let n of this.notes) {
          this.userService.getById(n.user_id)
            .pipe(first())
            .subscribe(result => {
              n.user = result;
              i++;
              if (i == this.notes.length) {
                self.done();
              }
            });
        }
      });
  }

  done() {
    this.isLoaded = true;
  }
}
