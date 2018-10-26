import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
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
export class TableComponent implements OnInit, OnChanges {

  @Input()
  private stationId: string;

  private currentStation: Station;
  datePicker;

  private allIntervals: string[];
  private intervalsFiltered: string[];
  private noDateSelected: boolean;
  private noIntervalSelected: boolean;
  private dateLoading: boolean;

  constructor(private stationService: StationsService, private alertService: AlertService) { }

  ngOnInit() {
    this.noDateSelected = true;
    this.noIntervalSelected = true;
    this.dateLoading = false;
    let self = this;
    this.datePicker = flatpickr('#datePicker', {
      locale: French,
      altInput: true,
      dateFormat: 'Y-m-d',
      onChange: function(selectedDates, dateStr, instance) {
        self.dateChanged(selectedDates, dateStr, instance);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const self = this;
    const prom1 = new Promise((resolve, reject) => {
      this.stationService.getById(this.stationId).pipe().subscribe(station => {
        self.currentStation = station;
        resolve();
      });
    });
    const prom2 = new Promise((resolve, reject) => {
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


  dateChanged(selectedDates, dateStr, instance) {
    this.noDateSelected = false;
    // Va falloir récup pour la date choisie ==> Lancer le loader
    this.dateLoading = true;
    // Lorsque la promesse est terminée ==> Stop le loader
    console.log(selectedDates);
    console.log(dateStr);
    console.log(instance);
    this.stationService.getData(stationId, date).pipe().subscribe(rainDatas => {
      console.log(rainDatas);
    });
    // Load les dates afficher loading
  }
  intervalleChanged(val) {
    this.noIntervalSelected = false;
    console.log(val);
  }
}
