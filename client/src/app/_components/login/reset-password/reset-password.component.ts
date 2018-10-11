import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService, AuthenticationService } from "../../../_services";
import { ActivatedRoute, Router } from "@angular/router";
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

  private sub: any;
  private id: string;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() {
    this.pwdForm = this.formBuilder.group({
      pwd: ['', Validators.required],
      pwdConf: ['', Validators.required],
    });

    const self = this;
    self.sub = self.route.params.subscribe((params) => {
      self.id = params['id'];
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
