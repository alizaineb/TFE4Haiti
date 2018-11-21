import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Station } from '../../../_models/';
import { RainData } from '../../../_models/rainData';
import {AlertService, UserService, DataService, AuthenticationService} from '../../../_services/';
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

  currentStation: Station;
  datePicker;

  private cols: string[];
  private rows: string[];

  private allIntervals: string[];
  intervalsFiltered: string[];
  private allDatas: RainData[];
  private aggregatedDatas: RainData[][];

  private sums: number[];
  private mins: RainData[];
  private maxs: RainData[];

  private intervalSelected: string;
  private ratio: number

  intervalDay: boolean;
  noDateSelected: boolean;
  dataLoading: boolean;
  noData: boolean;
  dataToShow: boolean;
  sameIntervalAsStation: boolean;
  dataToEdit: RainData;

  // Recap values
  private totVals: number;
  private totSum: number;
  private totMin: number;
  private totMax: number;


  constructor(private stationService: StationsService, private dataService: DataService, private alertService: AlertService) { }

  ngOnInit() {
    let date = new Date(Date.now());
    let elmnt = (<HTMLInputElement>document.getElementById('monthSelector'));
    //elmnt.value = date.getFullYear() + "-" + this.minTwoDigits(date.getMonth() + 1);
    elmnt.max = date.getFullYear() + "-" + this.minTwoDigits(date.getMonth() + 1);

    window.onresize = () => {
      this.computeWidth();
    };
    this.cols = [];
    this.rows = [];
    this.noDateSelected = true;
    this.dataLoading = false;
    this.noData = false;
    this.dataToShow = false;
    this.sameIntervalAsStation = false;
    this.intervalDay = true;

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
      self.intervalleChanged(self.currentStation.interval);
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
    for (let i = 0; i < 24; i++) {
      this.cols[i] = this.minTwoDigits(i);
    }
    this.noDateSelected = false;
    // Va falloir récup pour la date choisie ==> Lancer le loader
    this.dataLoading = true;
    this.noData = false;
    this.dataToShow = false;
    // Lorsque la promesse est terminée ==> Stop le loader
    this.stationService.getData(this.stationId, dateStr).subscribe(rainDatas => {
      self.dataLoading = false;
      if (!rainDatas || rainDatas.length == 0) {
        self.noData = true;
      } else {
        self.dataToShow = true;
        self.allDatas = rainDatas;
        self.computeDataToShow();

      }
    }, error => {
      self.dataLoading = false;
      self.dataToShow = false;
      self.alertService.error(error);
    });
  }

  hasAccessToStation(){

    return this.stationService.hasAccessToStation(this.currentStation);
  }

  intervalleChanged(val) {
    this.sameIntervalAsStation = false;
    let intervalIdx = this.intervalsFiltered.indexOf(val);
    if (intervalIdx < 0) {
      return;
    } else if (intervalIdx == 0 && this.hasAccessToStation()) {
      this.sameIntervalAsStation = true;
    }
    //
    let base = 0;
    // Minutes
    if (val.indexOf("m") >= 0) {
      this.intervalDay = true;
      base = 60;
    }// Heures
    else {
      this.intervalDay = false;
      base = 24;
      let el = (<HTMLInputElement>document.getElementById('monthSelector'));
      if (!el.value) {
        this.noDateSelected = true;
        this.dataToShow = false;
      }
    }

    this.intervalSelected = val;
    let jump = this.getHopSize(val);
    this.ratio = base / jump;
    this.rows = [];
    for (let i = 0; i < this.ratio; i++) {
      this.rows[i] = this.minTwoDigits(i * jump);
      if (this.intervalSelected != this.currentStation.interval && this.intervalSelected != "1h") {
        this.rows[i] = this.rows[i] + " à " + this.minTwoDigits(((i + 1) * jump) - 1);
      }
    }
    // Si y'a des données, compute les
    if (this.dataToShow) {
      this.computeDataToShow();
    }
  }

  monthPicked(val) {
    let date = val.target.value.split("-");
    let self = this;

    for (let i = 0; i < this.daysInMonth(date[1], date[0]); i++) {
      this.cols[i] = this.minTwoDigits(i + 1);
    }
    this.noDateSelected = false;
    // Va falloir récup pour la date choisie ==> Lancer le loader
    this.dataLoading = true;
    this.noData = false;
    this.dataToShow = false;
    // Lorsque la promesse est terminée ==> Stop le loader
    this.dataService.getDataForMonth(this.stationId, date[0], date[1]).subscribe(rainDatas => {
      self.dataLoading = false;
      if (!rainDatas || rainDatas.length == 0) {
        self.noData = true;
      } else {
        self.dataToShow = true;
        self.allDatas = rainDatas;
        self.computeDataToShow();

      }
    }, error => {
      self.dataLoading = false;
      self.dataToShow = false;
      self.alertService.error(error);
    });
  }
  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  private computeDataToShow() {
    this.aggregatedDatas = [];
    this.mins = [];
    this.maxs = [];
    this.sums = [];
    this.totVals = 0;
    this.totSum = 0;
    let hopSize = this.computeStep(this.intervalSelected, this.currentStation.interval);
    let idx = 0;
    for (let h = 0; h < this.allDatas.length; h = h + (hopSize * this.ratio)) {
      let tabToBePushed = [];
      // Used to compute moyenne
      let moy = 0;
      let min = Number.MAX_SAFE_INTEGER;
      let minIdx = -1;
      let max = -1;
      let maxIdx = -1;
      // This loop will compute for one hour
      for (let i = h; i < h + (hopSize * this.ratio); i = i + hopSize) {
        let sum = 0;
        let empty = 0;
        for (let j = i; j < i + hopSize; j++) {
          if (this.allDatas[j] && (this.allDatas[j].value || this.allDatas[j].value == 0)) {
            sum += this.allDatas[j].value;
          } else {
            empty++;
          }
        }
        // Update val
        let cloneObj = Object.assign({}, this.allDatas[i + hopSize - 1]);
        if (empty == hopSize) {
          cloneObj.value = undefined;
        } else {
          this.totVals++;
          this.totSum += sum;
          moy += sum;
          cloneObj.value = sum;
          // Min
          if (sum < min) {
            min = sum;
            minIdx = idx;
          }
          // Max
          if (sum > max) {
            max = sum;
            maxIdx = idx;
          }

        }
        tabToBePushed.push(cloneObj);
        idx++;
      }
      this.aggregatedDatas.push(tabToBePushed);
      // ICI push moy, min et max
      this.sums.push(moy / this.ratio);
      let minObjModified = {} as any;
      minObjModified.value = min;
      minObjModified.date = this.rows[minIdx % this.ratio];
      this.mins.push(minObjModified);
      let maxObjModified = {} as any;
      maxObjModified.value = max;
      maxObjModified.date = this.rows[maxIdx % this.ratio];
      this.maxs.push(maxObjModified);
    }
    this.totMin = 0;
    this.totMax = 0;
    // calcul minimum aboslu et max absolu
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < this.mins.length; i++) {
      if (this.mins[i].value < min) {
        min = this.mins[i].value;
      }
    }
    let max = -1;
    for (let i = 0; i < this.maxs.length; i++) {
      if (this.maxs[i].value > min) {
        max = this.maxs[i].value;
      }
    }
    this.totMin = min;
    this.totMax = max;

    this.computeWidth();
  }

  computeWidth() {
    if (this.aggregatedDatas) {
      let width = this.aggregatedDatas.length * 55 + 80 + 20; // 80 == width of first column and 20 = 10 padding + 10 padding
      let el = document.getElementById('switchDivs');
      if (el.offsetWidth < width) {
        let widthStr = width + "px";
        el.style.width = widthStr;
        el = document.getElementById('switchNav');
        el.style.width = widthStr;
      }
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
      case "1h":
        return 1;
      case "2h":
        return 2;
      case "6h":
        return 6;
      case "12h":
        return 12;
      case "24h":
        return 24;
      default:
        return 1;
    }
  }

  editData(data) {
    this.dataToEdit = data;
  }

  ngOnDestroy() {
    let el = document.getElementById('switchDivs');
    el.style.width = "";
    el = document.getElementById('switchNav');
    el.style.width = "";
  }
}
