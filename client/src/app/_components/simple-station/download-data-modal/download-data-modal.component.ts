import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr';
import { Constantes } from "../../../_helpers/constantes";

@Component({
  selector: 'app-download-data-modal',
  templateUrl: './download-data-modal.component.html',
  styleUrls: ['./download-data-modal.component.css']
})
export class DownloadDataModalComponent implements OnInit {



  @Output('downlaod')
  updated = new EventEmitter<any>();

  intervals: string[] = [];
  dateStart: Date;
  dateEnd: Date;
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

  }

  sendStation() {
    const dStart = new Date(Date.UTC(this.dateStart.getFullYear(), this.dateStart.getMonth(), this.dateStart.getDate()));
    const dEnd = new Date(Date.UTC(this.dateEnd.getFullYear(), this.dateEnd.getMonth(), this.dateEnd.getDate()));

    this.datesSelected.from = dStart;
    this.datesSelected.to = dEnd;
    let obj = {
      dates: this.datesSelected,
      interval: this.selectedInterval
    }
    //console.log(obj);
    this.updated.emit(obj);

  }

}
