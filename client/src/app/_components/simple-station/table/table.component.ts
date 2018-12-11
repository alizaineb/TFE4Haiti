import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Station } from '../../../_models/';
import { RainData } from '../../../_models/rainData';
import { AlertService, UserService, DataService, AuthenticationService } from '../../../_services/';
import { StationsService } from '../../../_services/stations.service';
import flatpickr from 'flatpickr';
import { French } from 'flatpickr/dist/l10n/fr';
import { MatDatepickerInputEvent } from "@angular/material";
import { MatDatepicker } from "@angular/material";

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

  private oldInterval: string;

  private allIntervals: string[];
  intervalsFiltered: string[];
  intervalsFilteredMn: string[];
  intervalsFilteredH: string[];
  private allDatas: RainData[];
  private aggregatedDatas: RainData[][];

  private sums: number[];
  private mins: RainData[];
  private maxs: RainData[];

  private hourOfDate: string;
  private splitHourOfDate: string;

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


  constructor(private stationService: StationsService, private dataService: DataService, private alertService: AlertService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.oldInterval = "";
    this.hourOfDate = "heure";
    this.splitHourOfDate = ":";

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


    const found = this.intervalsFiltered.findIndex(function(element) {
      return element.indexOf("h") >= 0;
    });
    this.intervalsFilteredMn = this.intervalsFiltered.slice(0, found);
    this.intervalsFilteredH = this.intervalsFiltered.slice(found, this.intervalsFiltered.length);
  }

  dateChanged(value) {
    value = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
    let self = this;
    this.cols = [];
    for (let i = 0; i < 24; i++) {
      this.cols[i] = this.minTwoDigits(i);
    }
    if (!value) {
      return;
    }
    this.noDateSelected = false;
    // Va falloir récup pour la date choisie ==> Lancer le loader
    this.dataLoading = true;
    this.noData = false;
    this.dataToShow = false;
    // Lorsque la promesse est terminée ==> Stop le loader
    this.stationService.getData(this.stationId, value).subscribe(rainDatas => {
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

  hasAccessToStation() {
    return this.stationService.hasAccessToStation(this.currentStation);
  }


  hasWorkerAccess() {
    return this.authenticationService.hasWorkerAccess();
  }

  intervalleChanged(val) {
    this.sameIntervalAsStation = false;
    let intervalIdx = this.intervalsFiltered.indexOf(val);
    if (intervalIdx < 0) {
      return;
    } else if (intervalIdx == 0 && this.hasAccessToStation()) {
      this.sameIntervalAsStation = true;
    }

    let base = 0;
    // Minutes
    if (val.indexOf("m") >= 0) {
      this.hourOfDate = "heure";
      this.splitHourOfDate = ":";
      this.intervalDay = true;
      base = 60;
    }// Heures
    else {
      this.hourOfDate = "date";
      this.splitHourOfDate = "/";
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
    let dateEl = (<HTMLInputElement>document.getElementById('datePicker'));
    let monthEl = (<HTMLInputElement>document.getElementById('monthSelector'));
    // On est passé d'un affichage mensuel à un affichage journalier (ou l'inverse)
    // Minutes vers heures
    if (this.oldInterval.indexOf('m') >= 0 && val.indexOf('h') >= 0) {
      // Reset datePicker
      // @ts-ignore : _flatpickr existe
      dateEl.value = '';
      this.noData = false;
      this.noDateSelected = true;
    }
    // Heures vers minutes
    else if (this.oldInterval.indexOf('h') >= 0 && val.indexOf('m') >= 0) {
      // Reset monthPickr
      monthEl.value = '';
      this.noData = false;
      this.noDateSelected = true;
    }

    if (!dateEl.value && !monthEl.value) {
      this.noDateSelected = true;
      this.dataToShow = false;
    }

    // Si y'a des données, compute les
    if (this.dataToShow) {
      this.computeDataToShow();
    }
    this.oldInterval = val;
  }

  monthPicked(val, dp) {
    let self = this;
    let monthEl = (<HTMLInputElement>document.getElementById('monthSelector'));
    monthEl.value = this.minTwoDigits(val.getMonth() + 1) + "/" + val.getFullYear();
    dp.close();
    for (let i = 0; i < this.daysInMonth(val.getMonth() + 1, val.getFullYear()); i++) {
      this.cols[i] = this.minTwoDigits(i + 1);
    }
    this.noDateSelected = false;
    // Va falloir récup pour la date choisie ==> Lancer le loader
    this.dataLoading = true;
    this.noData = false;
    this.dataToShow = false;
    // Lorsque la promesse est terminée ==> Stop le loader
    this.dataService.getDataForMonth(this.stationId, val.getFullYear(), val.getMonth() + 1).subscribe(rainDatas => {
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
    // Ici va falloir changer this.currentStation.interval
    let currentIntervalTmp = this.currentStation.interval;
    if (this.intervalSelected.indexOf('h') >= 0) {
      currentIntervalTmp = this.intervalsFilteredH[0];
    }

    let hopSize = this.computeStep(this.intervalSelected, currentIntervalTmp);
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
      let width = this.aggregatedDatas.length * 60 + 85 + 20; // 85 == width of first column and 20 = 10 padding + 10 padding
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
    // ça arrive pas car si intervalle == 10 on retire le choix 15 du la liste des intervalles
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
