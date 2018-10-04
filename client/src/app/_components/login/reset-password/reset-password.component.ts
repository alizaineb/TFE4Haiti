import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService, AuthenticationService } from "../../../_services";
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./../login.component.css']
})
export class ResetPasswordComponent implements OnInit {
  pwdForm: FormGroup;
  pwdSubmited = false;
  pwdNotMatch = false;

  constructor(private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.pwdForm = this.formBuilder.group({
      pwd: ['', Validators.required],
      pwdConf: ['', Validators.required],
    });
  }

  get r() {
    return this.pwdForm.controls;
  }

  sendPwd() {
    this.pwdSubmited = true;
    // stop here if form is invalid
    if (this.pwdForm.invalid) {
      return;
    }
    // Check que les mots de passe correspondent
    if (this.r.pwd.value != this.r.pwdConf.value) {
      this.pwdNotMatch = true;
      //this.alertService.error("Les mot de passe ne correspondent pas");
      return;
    }
    //todo create methode in the _services/authenticationservice
    this.authenticationService.resetPwd(this.r.pwd.value, this.r.pwdConf.value)
      .pipe(first())
      .subscribe(
        data => {
        },
        error => {
          this.alertService.error(error);
        });
  }
}
