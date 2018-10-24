import {Component, Input, OnInit} from '@angular/core';
import {StationsService} from "../../../_services/stations.service";

import {AlertService} from '../../../_services';
import {NoteService} from '../../../_services/note.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Note, Station} from '../../../_models';
import flatpickr from 'flatpickr';
import {French} from 'flatpickr/dist/l10n/fr';
import * as L from 'leaflet';
import {LatLng} from 'leaflet';

@Component({
  selector: 'app-import-station-modal',
  templateUrl: './import-station-modal.component.html',
  styleUrls: ['./import-station-modal.component.css']
})
export class ImportStationModalComponent implements OnInit {

  @Input()
  stationId: String;
  private dataForm: FormGroup;
  datePicker;


  constructor(private stationService: StationsService) {
  }

  ngOnInit() {
    this.dataForm = new FormGroup({

      'date': new FormControl(undefined, [
        Validators.required,
        Validators.max(31),
        Validators.min(1)
      ]),


    });
  this.initDatePickerAndMap();
  }

  initDatePickerAndMap() {
    const self = this;
    this.datePicker = flatpickr('#ImportDate', {
      locale: French,
      altInput: true,
      enableTime: true,
      altFormat: 'd-m-Y H:i',
      dateFormat: 'd-m-Y H:i',
      // onChange: function (selectedDates, dateStr, instance) {
      //   self.addStationForm.controls['createdAt'].setValue(new Date(selectedDates[0]));
      // }
    });
  }

}
