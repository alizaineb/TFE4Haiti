import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService, UserService } from '../../_services/index';
import { LocalstorageService } from "../../_services/localstorage.service";

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  loginSubmitted = false;
  registerSubmitted = false;
  returnUrl: string;
  roles: string[];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private localStorageService: LocalstorageService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      role: ['', Validators.required]
    });
    this.userService.getRoles().subscribe(roles => { this.roles = roles; });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  get r() {
    return this.registerForm.controls;
  }

  onLogin() {
    this.loginSubmitted = true;
    const self = this;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          self.router.navigate([this.returnUrl]);
          self.loading = false;
        },
        error => {
          self.alertService.error(error);
          self.loading = false;
        });
  }

  onRegister() {
    this.registerSubmitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const self = this;
    this.authenticationService.register(this.r.first_name.value, this.r.last_name.value, this.r.username.value, this.r.role.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(["/login"]);
          this.alertService.success("Votre compte a été créé !Veuillez attendre la validation par l'administrateur.");
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }
}
