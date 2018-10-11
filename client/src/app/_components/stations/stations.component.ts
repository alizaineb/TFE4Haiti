import {Component, OnInit, Output} from '@angular/core';
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
  stationsFiltered:Station[] = [];
  stationToDelete: Station;
  stationToUpdate: Station;

  constructor(private stationService: StationsService) {
    this.headers = ["Nom", "Latitude", "Longitude","Altitude", "Etat", "Créé le", "Dernière modification", "Intervalle"];
  }

  ngOnInit() {
    this.loadAllStations();
    this.stationToDelete = new Station();
    this.stationToUpdate = null
  }

  loadAllStations(){
    this.stationService.getAll()
      .pipe(first())
      .subscribe(result => {
        this.stations = result.slice(0);
        this.stationsFiltered = result.slice(0);
      });
  }

  filterStation(event) {
    const term = event.target.value;
    this.stationsFiltered = this.stations.filter((value) => {
      return value.name.toLowerCase().includes(term.toLowerCase());
    });
  }

  assignStationToDelete(station: Station){
    this.stationToDelete = station;
  }

  assignStationToUpdate(station: Station){
    this.stationToUpdate = station;
    // console.log(this.stationToUpdate)
  }

  deleteStation(choice: boolean){
    if(choice){
      this.stationService.delete(this.stationToDelete._id)
        .pipe(first())
        .subscribe(result => {
          this.loadAllStations();
        });
    } else {
      this.stationToDelete = new Station();
    }
  }

  sortData(headName:string){
      switch (headName) {
        case "Nom":
          if(this.stationsFiltered[0].name < this.stationsFiltered[1].name){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.name > val2.name ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.name > val1.name ? -1 : 1});
          }
          break;
        case "Latitude":
          if(this.stationsFiltered[0].latitude < this.stationsFiltered[1].latitude){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.latitude > val2.latitude ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.latitude > val1.latitude ? -1 : 1});
          }
          break;
        case "Longitude":
          if(this.stationsFiltered[0].longitude < this.stationsFiltered[1].longitude){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.longitude > val2.longitude ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.longitude > val1.longitude ? -1 : 1});
          }
          break;
        case "Altitude":
          if(this.stationsFiltered[0].altitude < this.stationsFiltered[1].altitude){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.altitude > val2.altitude ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.altitude > val1.altitude ? -1 : 1});
          }
          break;
        case "Intervalle":
          if(this.stationsFiltered[0].interval < this.stationsFiltered[1].interval){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.interval > val2.interval ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.interval > val1.interval ? -1 : 1});
          }
          break;
        case "Etat":
          if(this.stationsFiltered[0].state < this.stationsFiltered[1].state){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.state > val2.state ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.state > val1.state ? -1 : 1});
          }
          break;
        case "Créé le":
          if(this.stationsFiltered[0].createdAt < this.stationsFiltered[1].createdAt){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.createdAt > val2.createdAt ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.createdAt > val1.createdAt ? -1 : 1});
          }
          break;
        case "Dernière modification":
          if(this.stationsFiltered[0].updatedAt < this.stationsFiltered[1].updatedAt){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.updatedAt > val2.updatedAt ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.updatedAt > val1.updatedAt ? -1 : 1});
          }
          break;
      }
  }
}
