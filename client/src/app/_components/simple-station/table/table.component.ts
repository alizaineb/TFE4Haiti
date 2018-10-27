import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Station } from '../../../_models/';
import { RainData } from '../../../_models/rainData';
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

  private cols: string[];
  private rows: string[];

  private allIntervals: string[];
  private intervalsFiltered: string[];
  private allDatas: RainData[];
  private aggregatedDatas: RainData[];

  private intervalSelected: string;

  private noDateSelected: boolean;
  private noIntervalSelected: boolean;
  private dataLoading: boolean;
  private noData: boolean;
  private dataToShow: boolean;

  constructor(private stationService: StationsService, private alertService: AlertService) { }

  ngOnInit() {
    this.cols = [];
    this.rows = [];
    this.noDateSelected = true;
    this.noIntervalSelected = true;
    this.dataLoading = false;
    this.noData = false;
    this.dataToShow = false;

    let self = this;
    this.datePicker = flatpickr('#datePicker', {
      locale: French,
      altInput: true,
      dateFormat: 'Y-m-d',
      altFormat: 'd-m-Y',
      onChange: function(selectedDates, dateStr, instance) {
        self.dateChanged(selectedDates, dateStr, instance);
      }
    });
    for (let i = 0; i < 24; i++) {
      this.cols[i] = this.minTwoDigits(i);
    }
  }
  private minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
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
    if (this.currentStation.interval == '10min') {
      this.intervalsFiltered.splice(this.intervalsFiltered.indexOf("15min"), 1);
    }
  }


  dateChanged(selectedDates, dateStr, instance) {
    let self = this;
    this.noDateSelected = false;
    // Va falloir récup pour la date choisie ==> Lancer le loader
    this.dataLoading = true;
    this.noData = false;
    this.dataToShow = false;
    // Lorsque la promesse est terminée ==> Stop le loader
    this.stationService.getData(this.stationId, dateStr).subscribe(rainDatas => {
      self.dataLoading = false;
      if (rainDatas.length == 0) {
        self.noData = true;
      } else {
        self.dataToShow = true;
        self.allDatas = rainDatas;
        if (!self.noIntervalSelected) {
          self.computeDataToShow();
        }
      }
    }, error => {
      self.dataLoading = false;
      self.dataToShow = false;
      self.alertService.error(error);
    });
    // Load les dates afficher loading
  }


  intervalleChanged(val) {
    if (this.intervalsFiltered.indexOf(val) < 0) {
      return;
    }
    this.intervalSelected = val;
    this.noIntervalSelected = false;
    let jump = this.getHopSize(val);
    this.rows = [];
    for (let i = 0; i < 60 / jump; i++) {
      this.rows[i] = this.minTwoDigits(i * jump);
    }
    // Si y'a des données, compute les
    if (this.dataToShow) {
      this.computeDataToShow();
    }
  }

  private computeDataToShow() {
    console.log("Y'a qqchse à faire :3");
    this.aggregatedDatas = this.allDatas.slice();
    if (this.intervalSelected == this.currentStation.interval) {
      return;
    }
    // Va falloir use computeStep()
    let hopSize = this.computeStep(this.intervalSelected, this.currentStation.interval);
    let idx = 0;
    for (let i = 0; i < this.allDatas.length; i = i + hopSize) {
      let sum = 0;
      for (let j = i; j < i + hopSize; j++) {
        if (this.allDatas[j].value) {
          sum += this.allDatas[j].value;
        }
      }
      // Update val
      // Pas correct atm
      this.aggregatedDatas[idx++].value = sum;
    }
  }

  getRange(num) {
    return Array(num);
  }

  // Méthode utilisée pour calculer le bon entre chaque donnée
  computeStep(visée, current) {
    let biggest = this.getHopSize(visée);
    let small = this.getHopSize(current);
    if (small > biggest) {
      return;
    }
    // ça devrait jamais arriver mais on vérifie quand même
    // ça arrivera si l'utilisateur modifie les éléments html
    // ça arrive aps car si intervalle == 10 on retire le choix 15 du la liste des intervalles
    if (biggest == 15 && small == 10) {
      return;
    }
    return biggest / small;

  }
  private getHopSize(interval) {
    switch (interval) {
      case "1min":
        return 1;
      case "5min":
        return 5;
      case "10min":
        return 10;
      case "15min":
        return 15;
      case "30min":
        return 30;
      default:
        return 1;
    }
  }
}
