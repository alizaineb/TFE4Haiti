import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {first} from "rxjs/operators";
import {AlertService} from "../../../_services";
import {StationsService} from "../../../_services/stations.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Station} from "../../../_models";

@Component({
  selector: 'app-add-station-modal',
  templateUrl: './add-station-modal.component.html',
  styleUrls: ['./add-station-modal.component.css']
})
export class AddStationModalComponent implements OnInit{


  @Output()
  sent = new EventEmitter<boolean>();

  intervals = ['1min','5min','10min','15min','30min','1h','2h','6h','12h','24h'];
  station:Station = new Station('','',undefined,undefined,'',null,null,'',[]);
  submitted = false;

  addStationForm:FormGroup;

  constructor(private alertService:AlertService,
              private stationService:StationsService){

  }

  ngOnInit(): void {
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
    })
  }

  get name() { return this.addStationForm.get('name'); }
  get latitude() { return this.addStationForm.get('latitude'); }
  get longitude() { return this.addStationForm.get('longitude'); }
  get interval() { return this.addStationForm.get('interval'); }


  onSubmit() { this.submitted = true; }

  resetStation() {
    this.station = new Station('','',undefined,undefined,'',null,null,'',[]);
  }

  sendStation(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addStationForm.invalid) {
      return;
    }

    this.stationService.register(this.station)
      .pipe(first())
      .subscribe(
        result => {
          //trigger sent
          this.sent.emit(true);
          //Fermer la page
          let element: HTMLElement = document.getElementsByClassName('btn')[1] as HTMLElement;
          element.click();
          this.resetStation()
        },
        error => {
          this.alertService.error(error);
        });
  }
}
