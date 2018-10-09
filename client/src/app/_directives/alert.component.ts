import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

import {AlertService} from '../_services';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'alert',
  templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService, private taostr: ToastrService) {
  }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
     // this.message = message;
      if(message && message.type){
        let cssClass = 'alert alert-error';
        if(message.type == "success"){
          cssClass = 'alert alert-success';
        }

        this.taostr[message.type](message.text, message.type, {
          progressBar: true,
          closeButton: true,
          timeOut: 10000 //temps en millisecondes
        });

      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
