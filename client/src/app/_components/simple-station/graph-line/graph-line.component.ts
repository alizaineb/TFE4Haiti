import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../_services/data.service';
import * as Highcharts from 'highcharts/highstock';
import { Station } from '../../../_models';
import { StationsService } from '../../../_services/stations.service';
import {MatDatepickerInputEvent} from '@angular/material';
import {AlertService} from '../../../_services';

import {FormControl} from '@angular/forms';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment, Moment} from 'moment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-graph-line',
  templateUrl: './graph-line.component.html',
  styleUrls: ['./graph-line.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class GraphLineComponent implements OnInit {

  @Input()
  private stationId: string;

  station: Station;
  dataLoading: boolean;

  highChartLine;
  highChartBar;
  rangeData: string[];
  rangeSelected: string;

  currentDate: Date;
  yearSelected: number;
  currentYear: number;

  monthSelected: number;
  currentMonth: number;

  hide;

  groupPixelWidth = 50;
  valueDecimal = 2;

  typeGraph;

  fromDate: Date;
  endDate: Date;

  date = new FormControl(moment());


  constructor(private dataService: DataService, private stationService: StationsService, private alertService: AlertService) { }

  ngOnInit() {
    this.rangeData = ['Annuelles', 'Mensuelles', 'Quotidiennes'];
    this.rangeSelected = '';

    this.currentDate = new Date();
    this.yearSelected = this.currentDate.getFullYear();
    this.currentYear = this.currentDate.getFullYear();

    this.monthSelected = this.currentDate.getMonth() + 1;
    this.currentMonth = this.currentDate.getMonth() + 1;

    this.hide = false;

    this.loadStation();
    this.loadOptionsHighCharts();

  }

  getData(type: string, event: MatDatepickerInputEvent<Date>) {
    if (type === 'from') {
      this.fromDate = event.value;
    } else {
      this.endDate = event.value;
    }

    if (this.fromDate !== undefined  && this.fromDate !== null && this.endDate !== undefined && this.endDate !== null) {
      if (this.endDate < this.fromDate) {
        this.alertService.error('La date de fin est plus petite que celle de début');
      } else {
        this.loadRangeDate(
          this.fromDate.getDate(),
          this.fromDate.getMonth(),
          this.fromDate.getFullYear(),
          this.endDate.getDate(),
          this.endDate.getMonth(),
          this.endDate.getFullYear());
      }
    }
  }


  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normlizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.loadOneMonth(this.date.value.format('MM'), this.date.value.format('YYYY'))
  }

  hasAccessToStation(station) {
    return this.stationService.hasAccessToStation(station);
  }

  changeYear(newYear) {
    this.yearSelected = parseInt(newYear, 10);
    this.rangeDataChange(this.rangeSelected);
  }

  loadStation() {
    this.stationService.getById(this.stationId).subscribe(s => { this.station = s; });
  }

  rangeDataChange(val) {
    this.hide = false;
    this.rangeSelected = val;
    if (val === 'Mensuelles') {
      this.date = new FormControl(moment());
      this.loadOneMonth(this.date.value.format('MM'), this.date.value.format('YYYY'));
    } else if (val === 'Annuelles') {
      this.loadOneYear();
    } else {
      this.hide = true;
    }
  }

  showNoData() {
    this.highChartLine.renderer.text('Pas de données disponibles', 140, 120)
      .css({
        color: '#4572A7',
        fontSize: '30px'
      })
      .add();

    this.highChartBar.renderer.text('Pas de données disponibles', 140, 120)
      .css({
        color: '#4572A7',
        fontSize: '30px'
      })
      .add();
  }

  loadRangeDate(minDate, minMonth, minYear, maxDate, maxMonth, maxYear) {
    this.dataLoading = true;
    this.dataService.getAllRainDataGraphLineRangeDate(this.stationId, minDate, minMonth, minYear, maxDate, maxMonth, maxYear).subscribe(data => {
      const self = this;
      this.hide = false;
      // Create the chart
      this.highChartLine = Highcharts.stockChart('containerLine', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        series: [{
          name: 'Value',
          step: true,
          data: data,
          dataGrouping: {
            groupPixelWidth: self.groupPixelWidth // Quantity of points to group
          },
          tooltip: {
            valueDecimals: self.valueDecimal,
            valueSuffix: 'mm'
          }
        }]
      });
      // Create the chart
      this.highChartBar = Highcharts.stockChart('containerBar', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        series: [{
          type: 'column',
          name: 'Value:',
          data: data,
          tooltip: {
            valueDecimals: self.valueDecimal,
            valueSuffix: 'mm'
          }
        }],
        chart: {
          alignTicks: false
        },
      });
      if (data.length === 0) {
        this.showNoData();
      }
    });
  }

  loadOneMonth(month, year) {
    this.dataLoading = true;
    this.dataService.getAllRainDataGraphLineOneMonth(this.stationId, month, year).subscribe(data => {
      const self = this;
      // Create the chart
      this.highChartLine = Highcharts.stockChart('containerLine', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        series: [{
          name: 'Value',
          step: true,
          data: data,
          dataGrouping: {
            groupPixelWidth: self.groupPixelWidth // Quantity of points to group
          },
          tooltip: {
            valueDecimals: self.valueDecimal,
            valueSuffix: 'mm'
          }
        }]
      });
      // Create the chart
      this.highChartBar = Highcharts.stockChart('containerBar', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        series: [{
          type: 'column',
          name: 'Value:',
          data: data,
          tooltip: {
            valueDecimals: self.valueDecimal,
            valueSuffix: 'mm'
          }
        }],
        chart: {
          alignTicks: false
        },
      });
      if (data.length === 0) {
        this.showNoData();
      }
    });
  }

  loadOneYear() {
    const self = this;
    this.dataLoading = true;
    this.dataService.getAllRainDataGraphLineOneYear(this.stationId, this.yearSelected).subscribe(data => {
      // Create the chart
      this.highChartLine = Highcharts.stockChart('containerLine', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        series: [{
          name: 'Value',
          step: true,
          data: data,
          tooltip: {
            valueDecimals: self.valueDecimal,
            valueSuffix: 'mm'
          }
        }]
      });
      // Create the chart
      this.highChartBar = Highcharts.stockChart('containerBar', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        series: [{
          type: 'column',
          name: 'Value:',
          data: data,
          dataGrouping: {
            groupPixelWidth: self.groupPixelWidth // Quantity of points to group
          },
          tooltip: {
            valueDecimals: self.valueDecimal,
            valueSuffix: 'mm'
          }
        }],
        chart: {
          alignTicks: false
        },
      });

      let emptyData = true;
      for (let i = 0; i < data.length; i++) {
        if (data[i][1] !== null) {
          emptyData = false;
          break;
        }
      }
      if (emptyData) {
        this.showNoData();
      }
    });

  }

  loadOptionsHighCharts() {
    const self = this;

    Highcharts.setOptions({
      chart: {
        events: {
          load: function() {
            self.dataLoading = false;
          }
        }
      },
      lang: {
        loading: 'Chargement...',
        noData: 'Pas de données',
        months: [
          'Janvier', 'Février', 'Mars', 'Avril',
          'Mai', 'Juin', 'Juillet', 'Août',
          'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ],
        weekdays: [
          'Dimanche', 'Lundi', 'Mardi', 'Mercredi',
          'Jeudi', 'Vendredi', 'Samedi'
        ],
        shortMonths: [
          'Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil',
          'Août', 'Sept', 'Oct', 'Nov', 'Dec'
        ],
      },
      noData: {
        style: {
          fontWeight: 'bold',
          fontSize: '15px',
          color: '#303030'
        }
      },
      scrollbar: {
        barBackgroundColor: 'gray',
        barBorderRadius: 7,
        barBorderWidth: 0,
        buttonBackgroundColor: 'gray',
        buttonBorderWidth: 0,
        buttonBorderRadius: 7,
        trackBackgroundColor: 'none',
        trackBorderWidth: 1,
        trackBorderRadius: 8,
        trackBorderColor: '#CCC'
      },
      xAxis: {
        type: 'datetime', // ensures that xAxis is treated as datetime values
        title: {
          text: 'Mois' // TODO
        },
      },
      yAxis: {
        title: {
          text: 'Précipitations (mm)'
        }
      },
      rangeSelector: {
        inputEnabled: true,
        selected: 6,
        buttons: [
          {
            type: 'minute',
            count: 5,
            text: '5min'
          },
          {
            type: 'minute',
            count: 30,
            text: '30min'
          },
          {
            type: 'minute',
            count: 60,
            text: '1h'
          }, {
            type: 'day',
            count: 1,
            text: '1d'
          }, {
            type: 'week',
            count: 1,
            text: '1w'
          }, {
            type: 'month',
            count: 1,
            text: '1m'
          }, {
            type: 'year',
            count: 1,
            text: '1y'
          }, {
            type: 'all',
            text: 'All'
          }]
      },
    });
  }


}
