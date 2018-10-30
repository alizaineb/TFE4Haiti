import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RainData } from '../../../../_models/rainData';
import { AlertService } from '../../../../_services';
import { DataService } from '../../../../_services/data.service';

@Component({
  selector: 'app-update-data-modal',
  templateUrl: './update-data-modal.component.html',
  styleUrls: ['./update-data-modal.component.css']
})
export class UpdateDataModalComponent implements OnInit {

  @Input()
  dataToUpdate: RainData;
  constructor(private alertService: AlertService, private dataService: DataService) { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.resetInput();
  }

  resetInput() {
    if (this.dataToUpdate) {
      (<HTMLInputElement>document.getElementById("inputValue")).value = "" + this.dataToUpdate.value;
    }
  }

  updateData() {
    this.dataService.updateData(this.dataToUpdate._id, (<HTMLInputElement>document.getElementById("inputValue")).value)
      .subscribe(
        result => {
          // trigger sent
          this.alertService.success('La requête a été envoyée à l\'administrateur');
        },
        error => {
          this.alertService.error(error);
        });
  }
}
