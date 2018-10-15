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

  searchKeyWord:string = '';

  constructor(private stationService: StationsService) {
    this.headers = ["Nom", "Etat", "Créé le", "Dernière modification"];
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
        this.filterStation();
      });
  }

  filterStation() {
    this.stationsFiltered = this.stations.filter((value) => {
      return value.name.toLowerCase().includes(this.searchKeyWord.toLowerCase());
    });
  }

  assignStationToDelete(station: Station){
    this.stationToDelete = station;
  }

  assignStationToUpdate(station: Station){
    this.stationToUpdate = station;
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
          if(this.stationsFiltered[0].name <= this.stationsFiltered[1].name){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.name.toLowerCase() > val2.name.toLowerCase() ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.name.toLowerCase() > val1.name.toLowerCase() ? -1 : 1});
          }
          break;
        case "Etat":
          if(this.stationsFiltered[0].state <= this.stationsFiltered[1].state){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.state > val2.state ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.state > val1.state ? -1 : 1});
          }
          break;
        case "Créé le":
          if(this.stationsFiltered[0].createdAt <= this.stationsFiltered[1].createdAt){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.createdAt > val2.createdAt ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.createdAt > val1.createdAt ? -1 : 1});
          }
          break;
        case "Dernière modification":
          if(this.stationsFiltered[0].updatedAt <= this.stationsFiltered[1].updatedAt){
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val1.updatedAt > val2.updatedAt ? -1 : 1});
          } else {
            this.stationsFiltered.sort((val1:Station, val2:Station)=> {return val2.updatedAt > val1.updatedAt ? -1 : 1});
          }
          break;
      }
  }
}
