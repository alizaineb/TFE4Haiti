import {Component, Input, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {DataService} from '../../../_services/data.service';
import {RainData} from '../../../_models/rainData';
import * as Highcharts from 'highcharts/highstock';
import {HttpClient} from '@angular/common/http';

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
         }
       });

       // Create the chart
       this.highChart = Highcharts.stockChart('container', {

         rangeSelector: {
           selected: 1
         },

         title: {
           text: 'AAPL Stock Price'
         },

         series: [{
           name: 'AAPL',
           data: data,
           tooltip: {
             valueDecimals: 2
           }
         }]
       });
     });

/*
    this.data = [
      [
        1540552440000,
        0.2
      ],
      [
        1540552500000,
        0
      ],
      [
        1540552560000,
        0.1
      ],
      [
        1540552620000,
        0.2
      ],
    ];

    */
  }

}
