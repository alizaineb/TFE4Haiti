import { Component, OnInit, Input } from '@angular/core';
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
    console.log("JMINIT");
  }

}
