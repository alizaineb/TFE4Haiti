import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Station} from "../../../_models";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../../_services";
import {StationsService} from "../../../_services/stations.service";
import flatpickr from "flatpickr";
import {French} from "flatpickr/dist/l10n/fr";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-update-sation-modal',
  templateUrl: './update-sation-modal.component.html',
  styleUrls: ['./update-sation-modal.component.css']
})
export class UpdateSationModalComponent implements OnInit {

  @Input()
  stationToUpdate:Station;

  @Output()
  updated = new EventEmitter<boolean>();

  intervals = ['1min','5min','10min','15min','30min','1h','2h','6h','12h','24h'];
  station:Station;
  submitted = false;

  addStationForm:FormGroup;
  datePicker;

  constructor(private alertService:AlertService,
              private stationService:StationsService){
  }

  ngOnInit(): void {
    this.station = this.stationToUpdate;
    this.addStationForm = new FormGroup({
      'name': new FormControl(this.station.name, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      'latitude': new FormControl(this.station.latitude, [
        Validators.required,
        Validators.max(90),
        Validators.min(-90)
      ]),
      'longitude': new FormControl(this.station.longitude, [
        Validators.required,
        Validators.max(180),
        Validators.min(-180)
      ]),
      'interval': new FormControl(this.station.interval, [
        Validators.required
      ]),
      'createdAt': new FormControl(this.station.createdAt, [
        Validators.required
      ])
    });


    this.datePicker = flatpickr("#createdAt", {
      defaultDate: this.station.createdAt,
      locale:French,
      altInput: true,
      altFormat: "d-m-Y",
      dateFormat: "d-m-Y"
    });
  }

  updateCreatedDate(){
    this.station.createdAt = new Date(this.datePicker.selectedDates[0]);
  }

  get name() { return this.addStationForm.get('name'); }
  get latitude() { return this.addStationForm.get('latitude'); }
  get longitude() { return this.addStationForm.get('longitude'); }
  get interval() { return this.addStationForm.get('interval'); }
  get createdAt() {return this.addStationForm.get('createdAt');}


  onSubmit() { this.submitted = true; }

  resetStation() {
    this.station = this.stationToUpdate;
    this.datePicker.setDate(this.stationToUpdate.createdAt)
  }

  sendStation(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addStationForm.invalid) {
      return;
    }
    this.stationService.update(this.station)
      .pipe(first())
      .subscribe(
        result => {
          //trigger sent
          this.updated.emit(true);
          //Fermer la page
        },
        error => {
          this.alertService.error(error);
        });
  }
}
