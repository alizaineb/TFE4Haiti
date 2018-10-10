import { Component, Input, OnInit } from '@angular/core';
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
    this.sendFeedbackForm.reset();
  }

  refuseUser() {
    let self = this;
    this.userService.refuseUser(this.currUser, this.sendFeedbackForm.get("note").value)
      .pipe(first())
      .subscribe(result => {
        this.sendFeedbackForm.reset();
        self.alertService.success("L'utilisateur a été refusé avec succès");
      },
        error => {
          self.alertService.error(error);
        });
  }
}
