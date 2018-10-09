import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-delete-station-modal',
  templateUrl: './delete-station-modal.component.html',
  styleUrls: ['./delete-station-modal.component.css']
})
export class DeleteStationModalComponent implements OnInit {

  @Input() station:String;
  @Output() selected = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  selectAnswer(agreed: boolean) {
    this.selected.emit(agreed);
  }

}
