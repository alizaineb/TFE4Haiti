import { Component, OnInit } from '@angular/core';

import { AlertService, DataService, UserService, StationsService } from '../../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private alertService: AlertService,
    private dataService: DataService,
    private userService: UserService,
    private stationsService: StationsService,
  ) { }

  ngOnInit() {
    // Get stats stations

    // Get stats users

    // Get stats datas
  }

}
