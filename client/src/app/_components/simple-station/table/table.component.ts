import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Station } from '../../../_models/';
import { AlertService, UserService } from '../../../_services/';
import { StationsService } from '../../../_services/stations.service';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input()
  private stationId: string;

  private currentStation: Station;
  datePicker;

  private allIntervals: string[];
  private intervalsFiltered: string[];

  constructor(private stationService: StationsService, private alertService: AlertService) { }

  ngOnInit() {
    console.log("AZEZA");
    this.datePicker = flatpickr('#createdAtAdd', {
      locale: French,
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y',
      onChange: function(selectedDates, dateStr, instance) {
        console.log("A");
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    let self = this;
    var prom1 = new Promise((resolve, reject) => {
      this.stationService.getById(this.stationId).pipe().subscribe(station => {
        self.currentStation = station;
        resolve();
      });
    });
    var prom2 = new Promise((resolve, reject) => {
      this.stationService.getIntervals().pipe().subscribe(intervalles => {
        self.allIntervals = intervalles;
        resolve();
      });
    });
    Promise.all([prom1, prom2]).then(function(values) {
      self.filterIntervals();
    });
  }

  filterIntervals() {
    this.intervalsFiltered = this.allIntervals.slice(this.allIntervals.indexOf(this.currentStation.interval), this.allIntervals.length);

  }
}
