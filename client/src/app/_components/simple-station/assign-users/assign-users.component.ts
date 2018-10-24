import {Component, Input, OnInit} from '@angular/core';
import {StationsService} from '../../../_services/stations.service';
import {AlertService, UserService} from '../../../_services';
import {NoteService} from '../../../_services/note.service';
import {Note, Station, User} from '../../../_models';
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

  constructor(
    private stationService: StationsService,
    private alertService: AlertService,
    private noteService: NoteService,
    private userService: UserService,
  ) {

  }

  ngOnInit() {
    this.stationService.getById(this.stationId)
      .pipe(
        map(station => {
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

    this.userService.getAll().subscribe(users => {this.listAllUsers = users; });
  }

  addUser(user: User, index) {
    this.listAllUsers.splice(index, 1);
    this.listUsers.push(user);
    this.alertService.success('L\'utilisateur a été ajoutée');
  }

  removeUser(user: User, index) {
    this.listUsers.splice(index, 1);
    this.listAllUsers.push(user);
    this.alertService.success('L\'utilisateur a été supprimée');
  }
}
