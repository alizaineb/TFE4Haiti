import { Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { UserService } from '../../_services/user.service';
import { Station } from '../../_models';
import { User } from '../../_models';
import { RainDataAwaiting, RainData } from '../../_models/rainData';
import { StationsService } from '../../_services/stations.service';
import { AlertService } from '../../_services/index';
import { DataService } from '../../_services/data.service';
import { environment } from '../../../environments/environment';
import { Constantes } from '../../_helpers/constantes'

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  dataLoading: boolean;
  currUser: string;
  showUsers: boolean;
  showStations: boolean;
  showDatas: boolean;

  pathApi = environment.apiHost;

  headersUsers: string[];
  headersStation: string[];
  headersData: string[];
  users = [];
  stations = [];
  rainDatas = [];
  private map: Map<string, string>;
  private mapUserFilter: Map<string, string>;

  constructor(
    private userService: UserService,
    private stationsService: StationsService,
    private alertService: AlertService,
    private rainDataService: DataService
  ) {
    this.headersUsers = ['Nom', 'Prénom', 'Adresse mail', 'Role requis', ' Date de création'];
    this.headersStation = ['Nom de la station', 'Coordonnées', 'Commune', 'Bassin versant', 'Intervalle', 'Auteur', 'Date de mise en service'];
    this.headersData = ['Nom de la Station', 'Ajouté par', 'Type', 'date', 'Valeur'];
    this.showUsers = false;
    this.showStations = false;
    this.showDatas = false;
  }

  ngOnInit() {

    this.dataLoading = false;
    this.loadAwaitingUsers();
    this.loadAwaitingStation();
    this.loadAwaitingData();
    this.map = new Map();
    this.map.set('Nom de la station', 'name');
    this.map.set('Latitude', 'latitude');
    this.map.set('Longitude', 'latitude');
    this.map.set('Intervalle', 'interval');
    this.map.set('Auteur', 'user_creator');
    this.map.set('Date de mise en service', 'createdAt');
    this.mapUserFilter = new Map();
    this.mapUserFilter.set('Nom', 'last_name');
    this.mapUserFilter.set('Prénom', 'first_name');
    this.mapUserFilter.set('Adresse mail', 'mail');
    this.mapUserFilter.set('Role requis mail', 'role');
    this.mapUserFilter.set('Date de création', 'created_at');
  }

  loadAwaitingUsers($event = null) {
    const self = this;
    this.userService.getAllAwaiting()
      .pipe(first())
      .subscribe(res => {
        self.users = res;
        if (res.length > 0) {
          this.showUsers = true;
        } else {
          this.showUsers = false;
        }
      });
  }

  loadAwaitingStation() {
    const self = this;
    this.stationsService.getAllAwaiting()
      .pipe(map(stations => {
        for (const n of stations) {
          this.userService.getById(n.user_creator_id).pipe(first()).subscribe(user => {
            n.user_creator = user.mail;
          });
        }
        return stations;
      })
      )
      .subscribe(res => {
        self.stations = res;
        if (res.length > 0) {
          this.showStations = true;
        } else {
          this.showStations = false;
        }
      });
  }

  loadAwaitingData() {
    this.dataLoading = false;
    const self = this;
    self.rainDataService.getAllAwaiting()
      .pipe(map(datas => {
        for (const n of datas) {
          this.stationsService.getById(n.id_station).pipe(first()).subscribe(station => {
            n.station = station.name;
          });
        }
        return datas;
      })
      )
      .pipe(map(datas => {
        for (const n of datas) {
          this.userService.getById(n.id_user).pipe(first()).subscribe(user => {
            n.user = user.first_name + ' ' + user.last_name;
          });
        }
        return datas;
      })
      ).subscribe(datas => {
        self.rainDatas = datas;
        self.showDatas = this.rainDatas.length > 0;
      },
        err => {
          this.alertService.error(err);
        });

  }

  isIndividual(data: RainDataAwaiting) {
    return data.type == Constantes.DataType.INDIVIDUAL;
  }
  isUpdate(data: RainDataAwaiting) {
    return data.type == Constantes.DataType.UPDATE;
  }

  isAFile(data: RainDataAwaiting) {
    return data.type == Constantes.DataType.FILE;
  }

  acceptData(data: RainDataAwaiting) {
    const self = this;
    this.dataLoading = true;
    self.rainDataService.accepteAwaiting(data._id).subscribe(res => {
      self.alertService.success('La donnée a été acceptée avec succès.');
      self.loadAwaitingData();

    },
      err => {
        self.alertService.error(err);
        self.loadAwaitingData();
      },
      () => {
        this.dataLoading = false;
      });
  }

  refuseData(data: RainDataAwaiting) {
    const self = this;
    this.dataLoading = true;
    self.rainDataService.refuseAwaiting(data._id).subscribe(res => {
      self.alertService.success('La donnée a été refusée avec succès.');
      self.loadAwaitingData();
    },
      err => {
        self.alertService.error(err);
        self.loadAwaitingData();
      },
      () => {
        this.dataLoading = false;
      });
  }

  setCurrUser(id: string) {
    this.currUser = id;
  }

  acceptUser(id: string) {
    const self = this;
    this.dataLoading = true;
    this.userService.acceptUser(id)
      .pipe(first())
      .subscribe(result => {
        self.loadAwaitingUsers();
        self.alertService.success('L\'utilisateur a été accepté avec succès');
      },
        error => {
          self.loadAwaitingUsers();
          self.alertService.error(error);
        },
        () => {
          this.dataLoading = false;
        });
  }

  acceptStation(station: Station) {
    const self = this;
    this.dataLoading = true;
    this.stationsService.acceptStation(station._id)
      .pipe(first())
      .subscribe(result => {
        self.loadAwaitingStation();
        self.alertService.success('La station a été accepté avec succès');
      },
        error => {
          self.loadAwaitingStation();
          self.alertService.error(error);
        },
        () => {
          this.dataLoading = false;
        });
  }

  refuseStation(station: Station) {
    const self = this;
    this.dataLoading = true;
    this.stationsService.delete(station._id)
      .pipe(first())
      .subscribe(result => {
        self.loadAwaitingStation();
        self.alertService.success('La station a été refusée avec succès');
      },
        error => {
          self.alertService.error(error);
          self.loadAwaitingStation();
        },
        () => {
          this.dataLoading = false;
        });
  }


  sortDataStation(head: string) {
    if (this.stations.length <= 1) {
      return;
    }
    const key = this.map.get(head);
    let i = 1;
    while (i < this.stations.length && this.stations[0][key] == this.stations[i][key]) {
      i++;
    }
    // Tous les champs sont égaux, pas besoin de trier
    if (i >= this.stations.length) {
      return;
    }
    if (this.stations[0][key] <= this.stations[i][key]) {
      this.stations.sort((val1: Station, val2: Station) => {
        if (typeof (val1[key]) == 'number') {
          return val1[key] > val2[key] ? -1 : 1;
        }
        return val1[key].toLowerCase() > val2[key].toLowerCase() ? -1 : 1;
      });
    } else {
      this.stations.sort((val1: Station, val2: Station) => {
        if (typeof (val1[key]) == 'number') {
          return val2[key] > val1[key] ? -1 : 1;
        }
        return val2[key].toLowerCase() > val1[key].toLowerCase() ? -1 : 1;
      });
    }
  }

  sortDataUser(head: string) {
    if (this.users.length <= 1) {
      return;
    }
    const key = this.mapUserFilter.get(head);
    let i = 1;
    while (i < this.users.length && this.users[0][key] == this.users[i][key]) {
      i++;
    }
    // Tous les champs sont égaux, pas besoin de trier
    if (i >= this.users.length) {
      return;
    }
    if (this.users[0][key] <= this.users[i][key]) {
      this.users.sort((val1: User, val2: User) => {
        return val1[key].toLowerCase() > val2[key].toLowerCase() ? -1 : 1;
      });
    } else {
      this.users.sort((val1: User, val2: User) => {
        return val2[key].toLowerCase() > val1[key].toLowerCase() ? -1 : 1;
      });
    }
  }

}
