import { Component, OnInit, Input } from '@angular/core';
import { Station } from '../../../_models/';
import { AlertService, UserService } from '../../../_services/';
import { StationsService } from '../../../_services/stations.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  @Input()
  private stationId: string;

  constructor(private stationService: StationsService, private alertService: AlertService) { }

  ngOnInit() {
  }

}
