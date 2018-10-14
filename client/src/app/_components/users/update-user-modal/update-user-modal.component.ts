import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
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

  updateUserForm:FormGroup;

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.updateUserForm = new FormGroup({
      'first_name': new FormControl(this.userToUpdate.first_name, [
        Validators.required
      ]),

      'last_name': new FormControl(this.userToUpdate.last_name, [
        Validators.required
      ])
    });
  }

  get first_name() { return this.updateUserForm.get('first_name'); }
  get last_name() { return this.updateUserForm.get('last_name'); }



}
