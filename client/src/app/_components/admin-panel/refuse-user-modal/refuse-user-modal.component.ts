import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AlertService } from "../../../_services";
import { UserService } from "../../../_services/user.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-refuse-user-modal',
  templateUrl: './refuse-user-modal.component.html',
  styleUrls: ['./refuse-user-modal.component.css']
})
export class RefuseUserModalComponent implements OnInit {

  @Input()
  currUser: string;

  @Output()
  sent = new EventEmitter<boolean>();

  sendFeedbackForm: FormGroup;
  note: String;

  constructor(private alertService: AlertService,
    private userService: UserService) { }

  ngOnInit() {
    this.note = "";
    let self = this;
    this.sendFeedbackForm = new FormGroup({
      'note': new FormControl(self.note)
    });
  }

  resetInterface() {
    this.sent.emit(true);
    this.sendFeedbackForm.reset();
  }

  refuseUser() {
    let self = this;
    let note = ((self.sendFeedbackForm.get("note").value) == null ? "" : self.sendFeedbackForm.get("note").value);
    this.userService.refuseUser(self.currUser, note)
      .pipe(first())
      .subscribe(result => {
        this.sendFeedbackForm.reset();
        self.sent.emit(true);
        self.alertService.success("L'utilisateur a été refusé avec succès");
      },
        error => {
          self.alertService.error(error);
        });
  }
}
