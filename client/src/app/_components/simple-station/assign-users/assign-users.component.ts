import { Component, Input, OnInit } from '@angular/core';
import { StationsService } from '../../../_services/stations.service';
import { AlertService, UserService } from '../../../_services';
import { Station, User } from '../../../_models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-assign-users',
  templateUrl: './assign-users.component.html',
  styleUrls: ['./assign-users.component.css']
})
export class AssignUsersComponent implements OnInit {

  @Input()
  private stationId: string;


  station: Station;
  listUsers: User[];
  listAllUsers: User[];
  listUsersFiltered: User[];
  listAllUsersFiltered: User[];

  searchKeyWord = '';
  searchAllKeyWord = '';

  constructor(
    private stationService: StationsService,
    private alertService: AlertService,
    private userService: UserService,
  ) {

  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.stationService.getById(this.stationId)
      .pipe(
        map(station => {
          this.userService.getAll()
            .pipe(
              map(users => {
                users = users.filter(u => !station.users.includes(u._id));
                return users;
              })
            )
            .subscribe(users => {
              this.listAllUsers = users;
              this.listAllUsersFiltered = this.listAllUsers;
            });

          const listUser = [];
          for (const id of station.users) {
            this.userService.getById(id).subscribe(user => {
              listUser.push(user);
            });
          }
          return [station, listUser];
        })
      )
      .subscribe(data => {
        // @ts-ignore
        this.station = data[0];
        // @ts-ignore
        this.listUsers = data[1];
        this.listUsersFiltered = this.listUsers;
      });


  }

  filterUser() {
    this.listUsersFiltered = this.listUsers.filter((value) => {
      return value.mail.toLowerCase().includes(this.searchKeyWord.toLowerCase()) ||
        value.first_name.toLowerCase().includes(this.searchKeyWord.toLowerCase()) ||
        value.last_name.toLowerCase().includes(this.searchKeyWord.toLowerCase());
    });
  }

  filterAllUser() {
    this.listAllUsersFiltered = this.listAllUsers.filter((value) => {
      return value.mail.toLowerCase().includes(this.searchAllKeyWord.toLowerCase()) ||
        value.first_name.toLowerCase().includes(this.searchAllKeyWord.toLowerCase()) ||
        value.last_name.toLowerCase().includes(this.searchAllKeyWord.toLowerCase());
    });
  }

  addUser(user: User) {
    this.stationService.addUser(this.stationId, user._id)
      .subscribe(
        () => {
          this.alertService.success('L\'utilisateur a été ajouté à la station');
          this.loadData();
        },
        error => this.alertService.error(error)
      );
  }

  removeUser(user: User) {
    this.stationService.removeUser(this.stationId, user._id)
      .subscribe(
        () => {
          this.alertService.success('L\'utilisateur a été supprimé de la station');
          this.loadData();
        },
        error => this.alertService.error(error)
      );
  }
}
