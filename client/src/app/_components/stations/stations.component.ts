import { Component, OnInit, Output } from '@angular/core';
import { first } from 'rxjs/operators';
import {Station, User} from "../../_models";
import { StationsService } from "../../_services/stations.service";

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})


export class StationsComponent implements OnInit {

  headers: string[];
  stations: Station[] = [];
  stationsFiltered: Station[] = [];
  stationToDelete: Station;
  stationToUpdate: Station;
  importDataStation: Station;

  currentPage = 1; // page courante des stations affichées
  map;

  searchKeyWord: string = '';

  constructor(private stationService: StationsService) {
    this.headers = ["Nom", "Etat", "Date de création", "Dernière modification"];
  }

  ngOnInit() {
    this.initMap();
    this.loadAllStations();
    this.stationToDelete = new Station();
    this.stationToUpdate = null;
    this.importDataStation = new Station();
  }

  loadAllStations($event=null) {
    this.stationService.getAll()
      .subscribe(result => {
        this.stations = result.slice(0);
        this.stationsFiltered = result.slice(0);
        this.filterStation();
      });
  }

  initMap(){
    this.map = new Map();
    this.map.set("Nom", "name");
    this.map.set("Date de création", "createdAt");
    this.map.set("Dernière modification","updatedAt");
    this.map.set("Etat", "state");
  }

  filterStation() {
    this.stationsFiltered = this.stations.filter((value) => {
      return value.name.toLowerCase().includes(this.searchKeyWord.toLowerCase());
    });
  }

  assignStationToDelete(station: Station) {
    this.stationToDelete = station;
  }

  assignStationToUpdate(station: Station) {
    this.stationToUpdate = station;
  }

  assignStationToImport(station: Station) {
    this.importDataStation = station;
  }

  deleteStation(choice: boolean) {
    if (choice) {
      this.stationService.delete(this.stationToDelete._id)
        .subscribe(result => {
          this.loadAllStations();
        });
    } else {
      this.stationToDelete = new Station();
    }
  }

  sortData(head: string) {
    if (this.stationsFiltered.length <= 1) {
      return;
    }
    let key = this.map.get(head);
    let i = 1;
    while (i < this.stationsFiltered.length && this.stationsFiltered[0][key] == this.stationsFiltered[i][key]) {
      i++;
    }
    // Tous les champs sont égaux, pas besoin de trier
    if (i > this.stationsFiltered.length) {
      return;
    }
    if (this.stationsFiltered[0][key] <= this.stationsFiltered[i][key]) {
      this.stationsFiltered.sort((val1: Station, val2: Station) => { return val1[key].toLowerCase() > val2[key].toLowerCase() ? -1 : 1 });
    } else {
      this.stationsFiltered.sort((val1: Station, val2: Station) => { return val2[key].toLowerCase() > val1[key].toLowerCase() ? -1 : 1 });
    }
  }

}
