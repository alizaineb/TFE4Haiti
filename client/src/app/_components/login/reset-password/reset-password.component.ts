import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService, AuthenticationService, UserService } from "../../../_services";
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
  tata: boolean;

  private sub: any;
  private id: string;
  private from: string;

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
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
      self.from = params['f'];
    });
    if (this.from == 'a') {
      this.tata = false;
    } else if (this.from = 'u') {
      this.tata = true;
    }
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
    let self = this;
    this.userService.changePwd(this.r.pwd.value, this.r.pwdConf.value, this.id).pipe(first()).subscribe(
      result => {
        self.alertService.success("Mot de passe remplacé, vous pouvez vous connecter.");
        self.router.navigate(['/login']);
      }, error => {
        self.alertService.error(error);
      }
    )
  }
}
