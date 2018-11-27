import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AlertService } from "../../../_services";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../_services/user.service";
import { StationsService } from '../../../_services/stations.service';
import { first } from "rxjs/operators";
import { User } from "../../../_models";
import { Constantes } from "../../../_helpers/constantes";

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.css']
})
export class UpdateUserModalComponent implements OnInit {

  @Input()
  userToUpdate: User;

  @Output()
  updated = new EventEmitter<boolean>();

  updateUserForm: FormGroup;

  roles: string[];
  communes: string[];
  bassin_versants: string[];
  // TODO Modifier et faire un call api pour ces valeurs
  states = [Constantes.userState.AWAITING, Constantes.userState.PASSWORD_CREATION, Constantes.userState.OK, Constantes.userState.DELETED];
  constructor(private alertService: AlertService, private userService: UserService, private stationService: StationsService) { }

  ngOnInit() {
    this.initForm();
    this.stationService.getCommunes().subscribe(communes => {
      this.communes = communes;
    });
    this.stationService.getBassin_versants().subscribe(bassin_versants => {
      this.bassin_versants = bassin_versants;
    });
    this.userService.getRoles().subscribe(roles => { this.roles = roles; });

  }

  initForm() {
    this.updateUserForm = new FormGroup({
      'first_name': new FormControl(this.userToUpdate.first_name, [
        Validators.required
      ]),

      'last_name': new FormControl(this.userToUpdate.last_name, [
        Validators.required
      ]),
      'mail': new FormControl(this.userToUpdate.mail, [
        Validators.required
      ]),
      'commune': new FormControl(this.userToUpdate.commune),
      'bassin_versant': new FormControl(this.userToUpdate.bassin_versant),
      'role': new FormControl(this.userToUpdate.role, [
        Validators.required
      ]),
      'state': new FormControl(this.userToUpdate.state, [
        Validators.required
      ])
    });
  }

  resetUser() {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.resetUser();
  }

  updateUser() {
    let userToSend = new User();
    userToSend._id = this.userToUpdate._id;
    userToSend.first_name = this.updateUserForm.get('first_name').value;
    userToSend.last_name = this.updateUserForm.get('last_name').value;
    userToSend.mail = this.updateUserForm.get('mail').value;
    userToSend.role = this.updateUserForm.get('role').value;
    userToSend.state = this.updateUserForm.get('state').value;
    userToSend.commune = this.updateUserForm.get('commune').value;
    userToSend.bassin_versant = this.updateUserForm.get('bassin_versant').value;
    this.userService.update(userToSend).pipe(first()).subscribe(
      result => {
        //trigger sent
        this.updated.emit(true);
        this.alertService.success("L'utilisateur a bien été mis à jour");
      },
      error => {
        this.alertService.error(error);
      });
  }

  get first_name() { return this.updateUserForm.get('first_name'); }
  get last_name() { return this.updateUserForm.get('last_name'); }
  get mail() { return this.updateUserForm.get('mail'); }
  get role() { return this.updateUserForm.get('role'); }
  get state() { return this.updateUserForm.get('state'); }
}
