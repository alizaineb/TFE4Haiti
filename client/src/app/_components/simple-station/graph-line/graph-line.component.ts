import {Component, Input, OnInit} from '@angular/core';
import {Chart} from 'chart.js';
import {DataService} from '../../../_services/data.service';
import {Data} from '../../../_models/data';
import flatpickr from "flatpickr";
import {French} from "flatpickr/dist/l10n/fr";

@Component({
  selector: 'app-graph-line',
  templateUrl: './graph-line.component.html',
  styleUrls: ['./graph-line.component.css']
})
export class GraphLineComponent implements OnInit {

  @Input()
  private stationId: string;

  lineChart: any;
  barChart: any;
  datePicker;

  listData: Data[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getAll(this.stationId).subscribe(data => {
      console.log(data);
      this.listData = data; });


    this.lineChart = new Chart('lineChart',
      {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'My First dataset',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
          }]
        },

        // Configuration options go here
        options: {
          title: {
            display: true,
            text: 'Custom Chart Title'
          }
        }
      });
    this.barChart = new Chart('barChart',
      {
        type: 'bar',
        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Custom Chart Title'
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

  }

}
