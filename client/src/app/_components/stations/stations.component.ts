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
  stationToDelete: Station;

  constructor(private stationService: StationsService) {
    this.headers = ["Nom", "Latitude", "Longitude", "Etat", "Créé le", "Dernière modification", "Intervalle"];
  }

  ngOnInit() {
    this.loadAllStations();
    this.stationToDelete = new Station('','',undefined,undefined,'',null,null,'',[]);
  }

  loadAllStations(){
    this.stationService.getAll()
      .pipe(first())
      .subscribe(result => {
        this.stations = result;
      });
  }

  assignStationToDelete(station: Station){
    this.stationToDelete = station
  }

  deleteStation(choice: boolean){
    if(choice){
      this.stationService.delete(this.stationToDelete._id)
        .pipe(first())
        .subscribe(result => {
          this.loadAllStations();
        });
    } else {
      this.stationToDelete = new Station('','',undefined,undefined,'',null,null,'',[]);
    }
  }

  sortData(headName:string){
      switch (headName) {
        case "Nom":
          if(this.stations[0].name < this.stations[1].name){
            this.stations.sort((val1:Station, val2:Station)=> {return val1.name > val2.name ? -1 : 1});
          } else {
            this.stations.sort((val1:Station, val2:Station)=> {return val2.name > val1.name ? -1 : 1});
          }
          break;
        case "Latitude":
          if(this.stations[0].latitude < this.stations[1].latitude){
            this.stations.sort((val1:Station, val2:Station)=> {return val1.latitude > val2.latitude ? -1 : 1});
          } else {
            this.stations.sort((val1:Station, val2:Station)=> {return val2.latitude > val1.latitude ? -1 : 1});
          }
          break;
        case "Longitude":
          if(this.stations[0].longitude < this.stations[1].longitude){
            this.stations.sort((val1:Station, val2:Station)=> {return val1.longitude > val2.longitude ? -1 : 1});
          } else {
            this.stations.sort((val1:Station, val2:Station)=> {return val2.longitude > val1.longitude ? -1 : 1});
          }
          break;
        case "Intervalle":
          if(this.stations[0].interval < this.stations[1].interval){
            this.stations.sort((val1:Station, val2:Station)=> {return val1.interval > val2.interval ? -1 : 1});
          } else {
            this.stations.sort((val1:Station, val2:Station)=> {return val2.interval > val1.interval ? -1 : 1});
          }
          break;
        case "Etat":
          if(this.stations[0].state < this.stations[1].state){
            this.stations.sort((val1:Station, val2:Station)=> {return val1.state > val2.state ? -1 : 1});
          } else {
            this.stations.sort((val1:Station, val2:Station)=> {return val2.state > val1.state ? -1 : 1});
          }
          break;
        case "Créé le":
          if(this.stations[0].createdAt < this.stations[1].createdAt){
            this.stations.sort((val1:Station, val2:Station)=> {return val1.createdAt > val2.createdAt ? -1 : 1});
          } else {
            this.stations.sort((val1:Station, val2:Station)=> {return val2.createdAt > val1.createdAt ? -1 : 1});
          }
          break;
        case "Dernière modification":
          if(this.stations[0].updatedAt < this.stations[1].updatedAt){
            this.stations.sort((val1:Station, val2:Station)=> {return val1.updatedAt > val2.updatedAt ? -1 : 1});
          } else {
            this.stations.sort((val1:Station, val2:Station)=> {return val2.updatedAt > val1.updatedAt ? -1 : 1});
          }
          break;
      }
  }
}
