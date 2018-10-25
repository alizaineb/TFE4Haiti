import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
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

  private currentStation: Station;

  private intervalles = ["1mn", "5mn", "10mn", "15mn", "30mn", "1h", "6h", "12h", "24h"];

  constructor(private stationService: StationsService, private alertService: AlertService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.stationService.getById(this.stationId).pipe().subscribe(station => {
      this.currentStation = station
    });
  }

}
