import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../_models";

@Component({
  selector: 'app-update-user-modal',
  templateUrl: './update-user-modal.component.html',
  styleUrls: ['./update-user-modal.component.css']
})
export class UpdateUserModalComponent implements OnInit {

  @Input()
  userToUpdate:User;

  @Output()
  updated = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit() {
  }

}
