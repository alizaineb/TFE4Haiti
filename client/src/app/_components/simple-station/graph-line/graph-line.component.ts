import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../../_services/data.service';
import * as Highcharts from 'highcharts/highstock';
import {Station} from "../../../_models";
import {StationsService} from "../../../_services/stations.service";

@Component({
  selector: 'app-graph-line',
  templateUrl: './graph-line.component.html',
  styleUrls: ['./graph-line.component.css']
})
export class GraphLineComponent implements OnInit {

  @Input()
  private stationId: string;

  station:Station;

  highChartLine;
  highChartBar;
  datePicker;
  rangeData = ['Mensuelles','Journalières','Horaires'];
  rangeSelected = 'Mensuelles';
  yearSelected = new Date().getFullYear();

  constructor(private dataService: DataService, private stationService: StationsService) { }

  loadStation(){
    this.stationService.getById(this.stationId).subscribe(s => {this.station = s})
  }

  rangeDataChange(val){
    console.log(val);
    this.rangeSelected = val;
    if(val === 'Horaires') {
      this.loadAll()
    } else {
      this.loadMonthly()
    }
  }

  updateYearSelected(op){
    if (op === "add"){
      this.yearSelected = this.yearSelected-1;
    } else {
      this.yearSelected = this.yearSelected+1;
    }
    this.loadMonthly();
  }

  loadAll(){
    this.dataService.getAllRainDataGraphLine(this.stationId).subscribe(data => {
      console.log(data);
      // Create the chart
      this.highChartLine = Highcharts.stockChart('containerLine', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        series: [{
          name: 'Value',
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


  loadMonthly(){
    this.dataService.getAllRainDataGraphLineMonthly(this.stationId,this.yearSelected).subscribe(data => {
      console.log(data);
      // Create the chart
      this.highChartLine = Highcharts.stockChart('containerLine', {
        title: {
          text: this.station.name + ' - Données pluviométriques (mm)'
        },
        series: [{
          name: 'Value',
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
    });
  }

  ngOnInit() {
    this.loadStation();
    this.loadMonthly();
    Highcharts.setOptions({

      lang: {
        loading: 'Chargement...',
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
      turboThreshold:0,
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
        type: 'datetime', //ensures that xAxis is treated as datetime values
        title: {
          text: "Mois"
        },
      },
      yAxis: {
        title: {
          text: "Précipitations (mm)"
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
