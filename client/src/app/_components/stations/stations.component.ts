import { Component, OnInit, Output } from '@angular/core';
import { Station } from '../../_models';
import { StationsService } from '../../_services/stations.service';
import { AuthenticationService } from "../../_services";

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})


export class StationsComponent implements OnInit {

  headers: string[];
  stations: Station[] = [];
  stationsFiltered: Station[] = [];
  stationSelected: Station = null;

  currentPage = 1; // page courante des stations affichées
  map;

  searchKeyWord = '';

  constructor(private stationService: StationsService,
    private authenticationService: AuthenticationService) {
    this.headers = ['Nom', 'Commune', 'Bassin versant', 'Date de création', 'Dernière modification', 'Etat'];
  }

  ngOnInit() {
    this.initMap();
    this.loadAllStations();
  }

  loadAllStations($event = null) {
    this.stationService.getAll()
      .subscribe(result => {
        this.stations = result.slice(0);
        this.stationsFiltered = result.slice(0);
        this.filterStation();
      });
  }

  hasAdminAccess() {
    return this.authenticationService.hasAdminAccess();
  }

  hasAccessToStation(station) {
    return this.stationService.hasAccessToStation(station);
  }

  hasWorkerAccess() {
    return this.authenticationService.hasWorkerAccess();
  }

  hasViewerAccess() {
    return this.authenticationService.hasViewerAccess();
  }

  initMap() {
    this.map = new Map();
    this.map.set('Nom', 'name');
    this.map.set('Date de création', 'createdAt');
    this.map.set('Dernière modification', 'updatedAt');
    this.map.set('Etat', 'state');
    this.map.set('Commune', 'commune');
    this.map.set('Rivière', 'river');
  }

  filterStation() {
    this.stationsFiltered = this.stations.filter((value) => {
      return (value.name.toLowerCase().includes(this.searchKeyWord.toLowerCase()) ||
        value.bassin_versant.toLowerCase().includes(this.searchKeyWord.toLowerCase()) ||
        value.commune.toLowerCase().includes(this.searchKeyWord.toLowerCase())) && this.hasAccessToStation(value);
    });
  }


  setStationSelected(station: Station) {
    this.stationSelected = station;
  }

  deleteStation(choice: boolean) {
    if (choice) {
      this.stationService.delete(this.stationSelected._id)
        .subscribe(result => {
          this.loadAllStations();
        });
    }
  }

  sortData(head: string) {
    if (this.stationsFiltered.length <= 1) {
      return;
    }
    const key = this.map.get(head);
    let i = 1;
    while (i < this.stationsFiltered.length && this.stationsFiltered[0][key] === this.stationsFiltered[i][key]) {
      i++;
    }
    // Tous les champs sont égaux, pas besoin de trier
    if (i > this.stationsFiltered.length || !this.stationsFiltered[i]) {
      return;
    }
    if (this.stationsFiltered[0][key] <= this.stationsFiltered[i][key]) {
      this.stationsFiltered.sort((val1: Station, val2: Station) => val1[key].toLowerCase() > val2[key].toLowerCase() ? -1 : 1);
    } else {
      this.stationsFiltered.sort((val1: Station, val2: Station) => val2[key].toLowerCase() > val1[key].toLowerCase() ? -1 : 1);
    }
  }

}
