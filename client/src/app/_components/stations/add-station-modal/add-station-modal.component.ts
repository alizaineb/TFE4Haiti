import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StationsService} from "../../../_services/stations.service";
import {Station} from "../../../_models";
import {first} from "rxjs/operators";
import { AlertService} from "../../../_services";


@Component({
  selector: 'app-add-station-modal',
  templateUrl: './add-station-modal.component.html',
  styleUrls: ['./add-station-modal.component.css']
})
export class AddStationModalComponent implements OnInit {

  private addStationForm: FormGroup;
  private stationSubmitted = false;
  private loading = false;

  constructor(private formBuilder: FormBuilder,
              private stationService: StationsService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.addStationForm = this.formBuilder.group({
      name: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      altitude: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  get getAddStationForm() {
    return this.addStationForm.controls;
  }

  sendStation(){
    this.stationSubmitted = true;
    // stop here if form is invalid
    if (this.addStationForm.invalid) {
      return;
    }
    this.loading = true;
    let newStation:Station = new Station();
    newStation.name = this.getAddStationForm.name.value;
    newStation.latitude = this.getAddStationForm.latitude.value;
    newStation.longitude = this.getAddStationForm.longitude.value;
    newStation.createdAt = this.getAddStationForm.date.value;
    this.stationService.register(newStation)
      .pipe(first())
      .subscribe(
        result => {
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
