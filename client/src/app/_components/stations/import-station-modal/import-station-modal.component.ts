import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-import-station-modal',
  templateUrl: './import-station-modal.component.html',
  styleUrls: ['./import-station-modal.component.css']
})
export class ImportStationModalComponent implements OnInit {

  @Input()
  stationId: String;

  constructor() { }

  ngOnInit() {
  }

}
