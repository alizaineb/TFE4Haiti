import { Component, Input, OnInit } from '@angular/core';
//import {Chart} from 'chart.js';
import { DataService } from '../../../_services/data.service';
import { RainData } from '../../../_models/rainData';
import * as Highcharts from 'highcharts/highstock';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-graph-line',
  templateUrl: './graph-line.component.html',
  styleUrls: ['./graph-line.component.css']
})
export class GraphLineComponent implements OnInit {

  @Input()
  private stationId: string;

  highChart;

  datePicker;

  listData: RainData[];

  constructor(private dataService: DataService,
    private http: HttpClient) { }

  ngOnInit() {
    this.dataService.getAllRainDataGraphLine(this.stationId).subscribe(data => {
      console.log(data);

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
        turboThreshold:0
      });

      // Create the chart
      this.highChart = Highcharts.stockChart('container', {

        rangeSelector: {
          inputEnabled: false,
          selected: 1,
          buttons: [
            {
              type: 'minute',
              count: 5,
              text: '5min'
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

        title: {
          text: 'AAPL Stock Price'
        },
        xAxis: {
          type: 'datetime'
        },
        series: [{
          name: 'Données pluviométriques',
          data: data,
          tooltip: {
            valueDecimals: 2
          }
        }]
      });
    });
  }

}
