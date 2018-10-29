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
  private aggregatedDatas: RainData[][];

  private sums: number[];
  private mins: RainData[];
  private maxs: RainData[];

  private intervalSelected: string;
  private ratio: number;

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
    this.ratio = 60 / jump;
    this.rows = [];
    for (let i = 0; i < this.ratio; i++) {
      this.rows[i] = this.minTwoDigits(i * jump);
      if (this.intervalSelected != this.currentStation.interval) {
        this.rows[i] = this.rows[i] + " à " + this.minTwoDigits(((i + 1) * jump) - 1);
      }
    }
    // Si y'a des données, compute les
    if (this.dataToShow) {
      this.computeDataToShow();
    }
  }

  private computeDataToShow() {
    // Va falloir use computeStep()
    this.aggregatedDatas = [];
    this.mins = [];
    this.maxs = [];
    this.sums = [];

    let hopSize = this.computeStep(this.intervalSelected, this.currentStation.interval);
    let idx = 0;
    for (let h = 0; h < this.allDatas.length; h = h + (hopSize * this.ratio)) {
      let tabToBePushed = [];

      // Used to compute moyenne
      let moy = 0;

      // This loop will compute for one hour
      for (let i = h; i < h + (hopSize * this.ratio); i = i + hopSize) {
        let sum = 0;
        let empty = 0;
        for (let j = i; j < i + hopSize; j++) {
          if (this.allDatas[j] && this.allDatas[j].value) {
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
          moy += sum;
          cloneObj.value = sum;
        }
        tabToBePushed.push(cloneObj);
        idx++;
      }
      this.aggregatedDatas.push(tabToBePushed);
      // ICI push moy, min et max
      this.sums.push(moy / this.ratio);
      let minTmp = tabToBePushed.reduce((acc, num) => {
        if (!acc.value && num.value) {
          acc = num;
        }
        if (acc.value && num.value && num.value < acc.value) {
          acc = num;
        }
        return acc;
      }, { value: Number.MAX_SAFE_INTEGER });

      this.mins.push(minTmp);

      let maxTmp = tabToBePushed.reduce((acc, num) => {
        if (!acc.value && num.value) {
          acc = num;
        }
        if (acc.value && num.value && num.value > acc.value) {
          acc = num;
        }
        return acc;
      }, { value: -1 });
      this.maxs.push(maxTmp);
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
        return 60;
      default:
        return 1;
    }
  }
}
