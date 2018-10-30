import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { RainData } from '../../../../_models/rainData';

@Component({
  selector: 'app-update-data-modal',
  templateUrl: './update-data-modal.component.html',
  styleUrls: ['./update-data-modal.component.css']
})
export class UpdateDataModalComponent implements OnInit {

  @Input()
  dataToUpdate: RainData;
  constructor() { }

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
    console.log((<HTMLInputElement>document.getElementById("inputValue")).value);
  }
}
