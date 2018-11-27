import { Component, OnInit } from '@angular/core';

import { AlertService, DataService, UserService, StationsService } from '../../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private stationStats;

  constructor(
    private alertService: AlertService,
    private dataService: DataService,
    private userService: UserService,
    private stationsService: StationsService,
  ) { }

  ngOnInit() {
    // Get stats stations
    this.stationsService.getStats().subscribe(stationStats => {
      this.stationStats = stationStats;
    }, err => {
      this.alertService.error('Erreur récupération lors de la récupération des statistiques des stations');
    });

    // Get stats users

    // Get stats datas
  }

}
