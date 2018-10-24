import { Component, Input, OnInit } from '@angular/core';
import { StationsService } from '../../../_services/stations.service';
import { AlertService, UserService } from '../../../_services/';
import { NoteService } from '../../../_services/note.service';
import {Note, Station} from '../../../_models/';
import {first, mergeMap, retry} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { DemoserviceService } from './demoservice.service';
import { map } from 'rxjs/operators';





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
  ) {

  }

  ngOnInit() {
    this.loadData();
    this.addNoteForm = new FormGroup({
      'note': new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ])
    });
  }

  get note() { return this.addNoteForm.get('note'); }


  sendNote() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addNoteForm.invalid) {
      return;
    }

    const n = new Note();
    n.station_id = this.stationId;
    n.note = this.addNoteForm.controls['note'].value;
    this.noteService.register(n)
      .subscribe(
        newNote => {
          this.alertService.success('La note a été ajoutée');
          this.addNoteForm.reset();
          this.loadData();
        },
        error => {
          this.alertService.error(error);
        });
  }

  onSubmit() { this.submitted = true; }

  loadData() {
    this.noteService.getAll(this.stationId)
      .pipe(
        retry(3),
        map(notes => {
          notes.sort((val1: Note, val2: Note) => val1.createdAt > val2.createdAt ? -1 : 1);
          for (const n of notes) {
            this.userService.getById(n.user_id).subscribe(user => {
              // @ts-ignore
              n.last_name = user.last_name;
              // @ts-ignore
              n.first_name = user.first_name;
            });
          }
          return notes;
        })
      )
      .subscribe(notes => {
        this.notes = notes;
      });
  }
}
