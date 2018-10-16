import { Component, Input, OnInit } from '@angular/core';
import { StationsService } from "../../../_services/stations.service";
import { AlertService, UserService } from "../../../_services/";
import { NoteService } from "../../../_services/note.service";
import { Note } from "../../../_models/";
import { first } from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { DemoserviceService } from "./demoservice.service";
import { switchMap, map } from 'rxjs/operators';


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

  submitted = false;

  constructor(
    private stationService: StationsService,
    private alertService: AlertService,
    private noteService: NoteService,
    private userService: UserService,
    private dataService: DemoserviceService
  ) {

  }

  ngOnInit() {
    this.loadData();
    this.addNoteForm = new FormGroup({
      'note': new FormControl('',[
        Validators.required,
        Validators.maxLength(200)
      ])
    })
  }

  get note() { return this.addNoteForm.get('note'); }


  sendNote(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addNoteForm.invalid) {
      return;
    }

    let n = new Note();
    n.station_id = this.stationId;
    n.note = this.addNoteForm.controls['note'].value;
    this.noteService.register(n)
      .pipe(first())
      .subscribe(
        newNote => {
          this.alertService.success("La note a été ajoutée");
          this.addNoteForm.reset();
          this.loadData();
        },
        error => {
          this.alertService.error(error);
        });
  }

  onSubmit() { this.submitted = true; }

  /*loadData() {
    this.dataService.requestDataFromMultipleSources(this.stationId).subscribe(
      data => {
        this.notes = data[0];
        for(let n of this.notes){
          this.userService.getById(n.user_id).pipe(first())
            .subscribe(user => {
              console.log(user);
            })
        }
      },
      error => {
        console.error("Error saving food!");
        return throwError(error);  // Angular 6/RxJS 6
      }
    );
  }*/

  loadData() {
    /*this.noteService.getAll(this.stationId).pipe(
      postData => this.userService.getById(postData.user_id).pipe(
        userByPostData => ({ postData, userByPostData })
      )
    ).subscribe(({ postData, userByPostData })=> console.log(postData, userByPostData));
  }*/
  }

}
