import { Component, OnInit } from '@angular/core';
import {first} from 'rxjs/operators';
import {Station} from "../../_models";
import {StationsService} from "../../_services/stations.service";

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {

  headers: string[];
  stations:Station[] = [];

  constructor(private stationService: StationsService) {
    this.headers = ["Nom", "Latitude", "Longitude", "Type", "Etat", "Créé le", "Dernière modification"]
  }

  ngOnInit() {
    this.loadAllStations();
  }

  private loadAllStations(){
    this.stationService.getAll()
      .pipe(first())
      .subscribe(result => {
        this.stations = result;
      });
  }
}
