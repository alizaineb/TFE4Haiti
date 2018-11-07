import {
  Component,
  EventEmitter, Input,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {Station} from '../../../_models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../../_services';
import {StationsService} from '../../../_services/stations.service';
import flatpickr from 'flatpickr';
import {French} from 'flatpickr/dist/l10n/fr';
import {Constantes} from "../../../_helpers/constantes";

@Component({
  selector: 'app-download-data-modal',
  templateUrl: './download-data-modal.component.html',
  styleUrls: ['./download-data-modal.component.css']
})
export class DownloadDataModalComponent implements OnInit {


  @Input('stationToUpdate')
  stationToUpdate: Station = null;

  @Output()
  updated = new EventEmitter<boolean>();

  intervals: string[] = [];
  communes: string[];
  rivers: string[];
  submitted = false;

  DownloadStationForm: FormGroup;
  datePicker;

  mark;

  constructor(private alertService: AlertService,
              private stationService: StationsService) {
  }

  ngOnInit(): void {
    for(var i in Constantes.DownloadIntervals) {
      this.intervals.push(i);
      console.log("coucou", i);
    }

    if(this.stationToUpdate){
      this.initForm();
      this.initDatePicker();
    }

  }


  initForm() {
    this.DownloadStationForm = new FormGroup({

      'interval': new FormControl(this.stationToUpdate.interval, [
        Validators.required
      ]),

      'createdAt': new FormControl(this.stationToUpdate.createdAt, [
        Validators.required
      ])
      // Ajouter la méthode get en dessous pour chaque field
    });
  }


  get interval() { return this.DownloadStationForm.get('interval'); }
  get createdAt() {return this.DownloadStationForm.get('createdAt'); }
 

  ngAfterViewChecked(): void {
    // this.map.invalidateSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetStation();
  }

  onSubmit() { this.submitted = true; }

  resetStation() {
    this.initForm();
    if (this.datePicker) {
      this.datePicker.setDate(this.stationToUpdate.createdAt);
    }
    if (this.mark) {
      this.mark.setLatLng([this.stationToUpdate.latitude, this.stationToUpdate.longitude]);
    }
  }

  sendStation() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.DownloadStationForm.invalid) {
      return;
    }

    const s = new Station();
    s._id = this.stationToUpdate._id;

    s.interval = this.DownloadStationForm.controls['interval'].value;
    s.createdAt = this.DownloadStationForm.controls['createdAt'].value;

    // this.updated.emit(true);
    // this.stationService.update(s)
    //   .subscribe(
    //     result => {
    //       // trigger sent
    //
    //       this.alertService.success('La station a été modifiée');
    //     },
    //     error => {
    //       this.alertService.error(error);
    //     });
  }

  initDatePicker() {
    const self = this;
    this.datePicker = flatpickr('#createdAt2', {
      defaultDate: self.stationToUpdate.createdAt,
      locale: French,
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y',
      onChange: function(selectedDates, dateStr, instance) {
        self.DownloadStationForm.controls['createdAt'].setValue(new Date(selectedDates[0]));
      }
    });
  }
}


