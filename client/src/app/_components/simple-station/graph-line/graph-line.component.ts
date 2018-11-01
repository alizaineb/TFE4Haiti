import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../_services/data.service';
import * as Highcharts from 'highcharts/highstock';
import {Station} from '../../../_models';
import {StationsService} from '../../../_services/stations.service';

@Component({
  selector: 'app-graph-line',
  templateUrl: './graph-line.component.html',
  styleUrls: ['./graph-line.component.css']
})
export class GraphLineComponent implements OnInit {

  @Input()
  private stationId: string;

  station: Station;
  dataLoading: boolean;

  highChartLine;
  highChartBar;
  datePicker;
  rangeData: string[];
  rangeSelected: string;

  currentDate: Date;
  yearSelected: number;
  currentYear: number;

  monthSelected: number;
  currentMonth: number;

  constructor(private dataService: DataService, private stationService: StationsService) { }

  ngOnInit() {
    this.rangeData = ['Mensuelles', 'Journalières', 'Horaires'];
    this.rangeSelected = 'Mensuelles';

    this.currentDate = new Date();
    this.yearSelected = this.currentDate.getFullYear();
    this.currentYear = this.currentDate.getFullYear();

    this.monthSelected = this.currentDate.getMonth() + 1;
    this.currentMonth = this.currentDate.getMonth() + 1;

    this.dataLoading = true;
    this.loadStation();
    this.loadOneYear();
    this.loadOptionsHighCharts();
  }

  loadStation() {
    this.stationService.getById(this.stationId).subscribe(s => {this.station = s; });
  }
  rangeDataChange(val) {
    console.log(val);
    this.rangeSelected = val;
    if (val === 'Horaires') {
      this.loadAll();
    } else  if (val === 'Journalières') {
      this.loadOneMonth();
    } else {
      this.loadOneYear();
    }
  }
  updateYearSelected(op) {
    if (op === 'add') {
      this.yearSelected = this.yearSelected - 1;
    } else {
      this.yearSelected = this.yearSelected + 1;
    }
    this.loadOneYear();
  }
  updateMonthSelected(op) {
    if (op === 'add') {
      this.monthSelected = this.monthSelected - 1;
    } else {
      this.monthSelected = this.monthSelected + 1;
    }
    this.loadOneMonth();
  }
  showNoData(){
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
  loadOneMonth() {
    this.dataLoading = true;
    this.dataService.getAllRainDataGraphLineOneMonth(this.stationId, this.monthSelected, this.yearSelected).subscribe(data => {
      console.log(data);
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
            valueDecimals: 2
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
            valueDecimals: 2
          }
        }],
        chart: {
          alignTicks: false
        },
      });
      if(data.length === 0){
        this.showNoData();
      }
    });
  }
  loadAll() {
    this.dataLoading = true;
    this.dataService.getAllRainDataGraphLine(this.stationId).subscribe(data => {
      console.log(data);
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
            valueDecimals: 2
          }
        }]
      });
      // Create the chart
      this.highChartBar = Highcharts.stockChart('containerBar', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        chart: {
          alignTicks: false
        },
        series: [{
          type: 'column',
          name: 'Value:',
          data: data,
          tooltip: {
            valueDecimals: 2
          }
        }]
      });
    });
  }

  loadOneYear() {
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
            valueDecimals: 2
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
            valueDecimals: 2
          }
        }],
        chart: {
          alignTicks: false
        },
      });
      let emptyData = true;
      for(let i = 0; i < data.length; i++){
        if(data[i][1] !== null){
          emptyData = false;
          break;
        }
      }
      if(emptyData){
        this.showNoData();
      }
    });
  }

  loadOptionsHighCharts() {
    const self = this;

    Highcharts.setOptions({
      chart: {
        events: {
          load: function () {
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
      turboThreshold: 0,
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
          text: 'Mois'
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
