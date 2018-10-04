import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService, AuthenticationService} from "../../../_services";
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./../login.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      pwd: ['', Validators.required],
      confirmPwd: ['', Validators.required],
    });
  }

  get r() {
    return this.resetForm.controls;
  }

  sendPwd() {

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return;
    }

    //todo create methode in the _services/authenticationservice
    this.authenticationService.resetPwd(this.r.pwd.value, this.r.confirmPwd.value)
      .pipe(first())
      .subscribe(
        data => {
        },
        error => {
          this.alertService.error(error);
        });
  }
}
