import { Component, OnInit } from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-graph-line',
  templateUrl: './graph-line.component.html',
  styleUrls: ['./graph-line.component.css']
})
export class GraphLineComponent implements OnInit {

  lineChart:any;

  constructor() { }

  ngOnInit() {
    this.lineChart = new Chart('myChart',
      {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
          labels: ["January", "February", "March", "April", "May", "June", "July"],
          datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
          }]
        },

        // Configuration options go here
        options: {}
      });
  }

}
