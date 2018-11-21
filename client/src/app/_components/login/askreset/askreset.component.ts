import { Component, OnInit } from '@angular/core';
import { first } from "rxjs/operators";
import { AlertService } from "../../../_services";
import { UserService } from "../../../_services/user.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-askreset',
  templateUrl: './askreset.component.html',
  styleUrls: ['./askreset.component.css']
})
export class AskresetComponent implements OnInit {

  forgetForm: FormGroup;
  loading: boolean;
  constructor(private alertService: AlertService, private userService: UserService) { }

  ngOnInit() {
    this.forgetForm = new FormGroup({
      'mail': new FormControl('', [
        Validators.required
      ])
    });
  }

  get mail() { return this.forgetForm.get('mail') }

  sendRequestResetPwd() {
    this.userService.requestChangePwd(this.mail.value).pipe(first()).subscribe(
      result => {
        this.alertService.success("Un mail a été envoyé à l'adresse mail, si cette dernière est connue de notre base de données");
      }, error => {
        this.alertService.error(error);
      }
    )
  }
}
