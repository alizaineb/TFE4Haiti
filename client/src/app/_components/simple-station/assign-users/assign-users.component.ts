import {Component, Input, OnInit} from '@angular/core';
import {StationsService} from '../../../_services/stations.service';
import {AlertService, UserService} from '../../../_services';
import {Station, User} from '../../../_models';
import {map} from 'rxjs/operators';

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
      });


  }

  addUser(user: User) {
    this.stationService.addUser(this.stationId, user._id)
      .subscribe(
        () => { this.alertService.success('L\'utilisateur a été ajoutée');
          this.loadData();
        },
        error => this.alertService.error(error)
      );
  }

  removeUser(user: User) {
    this.stationService.removeUser(this.stationId, user._id)
      .subscribe(
        () => {this.alertService.success('L\'utilisateur a été supprimée');
          this.loadData();
          },
        error => this.alertService.error(error)
      );
  }
}
