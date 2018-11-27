import {Component, OnInit} from '@angular/core';

import {AlertService, DataService, UserService, StationsService} from '../../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stationStats;
  data: { awaiting: number, ok: number } = {awaiting: 0, ok: 0};

  constructor(
    private alertService: AlertService,
    private dataService: DataService,
    private userService: UserService,
    private stationsService: StationsService,
  ) {
  }

  ngOnInit() {
    // Get stats stations
    this.stationStats = {};
    this.stationStats.total = 0;
    this.stationStats.awaiting = 0;
    this.stationStats.broken = 0;
    this.stationStats.working = 0;
    this.stationStats.deleted = 0;
    this.stationsService.getStats().subscribe(stationStats => {
      this.stationStats = stationStats;
    }, err => {
      this.alertService.error('Erreur récupération lors de la récupération des statistiques des stations');
    });

    // Get stats users

    // Get stats datas
    this.dataService.getStats().subscribe(
      res => {
        this.data.ok = res.data;
        this.data.awaiting = res.awaiting;

      }, err => {
        this.alertService.error("Erreur lors de la recupération des statistiques des données existantes.");
      }
    )
  }

}
