import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import flatpickr from 'flatpickr';
import {French} from 'flatpickr/dist/l10n/fr';
import {Constantes} from "../../../_helpers/constantes";

@Component({
  selector: 'app-download-data-modal',
  templateUrl: './download-data-modal.component.html',
  styleUrls: ['./download-data-modal.component.css']
})
export class DownloadDataModalComponent implements OnInit {


  dateFrom: Date;
  dateTo: Date;

  @Output()
  updated = new EventEmitter<boolean>();

  intervals: string[] = [];
  datePicker;

  mark;

  constructor() {
  }

  ngOnInit(): void {
    const self = this;
    for (var i in Constantes.DownloadIntervals) {
      this.intervals.push(i);
    }

    // this.dateFrom = new Date();
    // this.dateTo = new Date();
    // // this.initDatePicker();
    if(!this.datePicker){
      this.datePicker = flatpickr('#datePickerDownload', {
        locale: French,
        mode: 'range',
        altInput: true,
        dateFormat: 'Y-m-d',
        altFormat: 'd-m-Y',
        onChange: function(selectedDates, dateStr, instance) {
          self.dateChanged(selectedDates, dateStr, instance);
        }
      });
    }


  }

  sendStation() {

    // this.updated.emit(true);
    // this.stationService.update(s)
    //   .subscribe(
    //     result => {
    //       // trigger sent
    //
    //       this.alertService.success('La station a été modifiée');
    //     },
    //     error => {
    //       this.alertService.error(error);
    //     });
  }

  initDatePicker() {
    const self = this;
    this.datePicker = flatpickr('#datePickerDownload', {
      // locale: French,
      mode: 'range',
      // altInput: true,
      // dateFormat: 'Y-m-d',
      // altFormat: 'd-m-Y',
      // onChange: function(selectedDates, dateStr, instance) {
      //   self.dateChanged(selectedDates, dateStr, instance);
      // }
    });
  }

  dateChanged(selectedDates, dateStr, instance) {
    if (selectedDates.length === 2) {
      const dateMin: Date = selectedDates[0];
      const dateMax: Date = selectedDates[1];
      console.log("Range : ", dateMin, dateMax)
    }
    // console.log("Range : ", selectedDates, dateStr, instance)
  }
}


