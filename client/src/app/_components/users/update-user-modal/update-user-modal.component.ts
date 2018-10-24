import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AlertService } from "../../../_services";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../../_services/user.service";
import { first } from "rxjs/operators";
import { User } from "../../../_models";

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

  // TODO Modifier et faire un call api pour ces valeurs
  roles: string[];
  states = ['awaiting', 'pwd_creation', 'ok', 'deleted'];
  constructor(private alertService: AlertService, private userService: UserService) { }

  ngOnInit() {
    this.initForm();
    this.userService.getRoles().subscribe(roles => { console.log(roles); this.roles = roles; });
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
    userToSend.mail = this.userToUpdate.mail;
    userToSend.role = this.updateUserForm.get('role').value;
    userToSend.state = this.updateUserForm.get('state').value;
    this.userService.update(userToSend).pipe(first()).subscribe(
      result => {
        //trigger sent
        this.updated.emit(true);
        this.alertService.success("L'utilisateur a bien été mis à jour");
      },
      error => {
        this.alertService.error("Une erreur est survenue lors de la mise à jour de l'utilisateur");
      });

  }

  get first_name() { return this.updateUserForm.get('first_name'); }
  get last_name() { return this.updateUserForm.get('last_name'); }
  get mail() { return this.updateUserForm.get('mail'); }
  get role() { return this.updateUserForm.get('role'); }
  get state() { return this.updateUserForm.get('state'); }
}
