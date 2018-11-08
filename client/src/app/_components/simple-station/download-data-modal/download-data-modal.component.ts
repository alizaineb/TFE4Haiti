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



  @Output('downlaod')
  updated = new EventEmitter<any>();

  intervals: string[] = [];
  datePicker;
  datesSelected;
  selectedInterval: string;

  mark;

  constructor() {
  }

  ngOnInit(): void {
    const self = this;
    self.datesSelected = {
      from: new Date(),
      to: new Date()
    };
    this.selectedInterval = Constantes.DownloadIntervals.DAYS;

    for (var i in Constantes.DownloadIntervals) {
      this.intervals.push(Constantes.DownloadIntervals[i]);
    }

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

    let obj = {
      dates : this.datesSelected,
      interval : this.selectedInterval
    }
    console.log(obj);
    this.updated.emit(obj);
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

  dateChanged(selectedDates, dateStr, instance) {
    if (selectedDates.length === 2) {
      const dateMin: Date = selectedDates[0];
      const dateMax: Date = selectedDates[1];
      this.datesSelected.from = dateMin;
      this.datesSelected.to = dateMax;
    }
  }
}


