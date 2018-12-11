import { Component, HostListener, OnInit } from '@angular/core';
import { Station } from '../../../_models';
import { StationsService } from '../../../_services/stations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RainData } from '../../../_models/rainData';
import { AlertService } from '../../../_services';
import { NgbTimepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { LocalstorageService } from '../../../_services/localstorage.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-import-data',
  templateUrl: './station-import-data.component.html',
  styleUrls: ['./station-import-data.component.css']
})
export class StationImportDataComponent implements OnInit {

  // sub to the route
  private sub: any;
  loading: boolean;

  currentStation: Station;

  data: { date: string, time: { hour: number, minute: number }, value: number }[];
  private selectedZone: string;

  selectedFile: File = null;


  constructor(private stationService: StationsService,
    private localStorageService: LocalstorageService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private configTimePicker: NgbTimepickerConfig,
    private _location: Location
  ) {
    this.configTimePicker.spinners = false;
  }

  ngOnInit() {

    const self = this;
    self.loading = true;
    self.selectedZone = 'manual';
    self.data = [];

    self.addData();


    self.sub = self.route.params.subscribe((params) => {
      const id = params['id'];
      self.stationService.getById(id).subscribe(
        station => {
          self.currentStation = station;

          self.loading = false;
        },
        err => {

          self.loading = false;
        }
      );
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.hasUnsavedData()) {
      $event.returnValue = true;
    }
  }


  hasUnsavedData() {
    if (this.selectedZone == 'manual') {
      const i = 0;
      const d = new Date(`${this.data[i].date}T${this.minTwoDigits(this.data[i].time.hour)}:${this.minTwoDigits(this.data[i].time['minute'])}:00Z`);
      if (d.getFullYear() != 1970) {
        return true;
      }
    } else {
      if (this.selectedFile) {
        return true;
      }
    }
    return false;

  }

  previousRoute() {
    this._location.back();
  }

  private addData(date = '', time = { hour: 0, minute: 0 }, value = 0) {
    this.data.push({ date: date, time: time, value: value });
  }


  isSelectetd(item: string) {
    const res = this.selectedZone === item;
    return { 'col-md-10': res, 'col-md-2': !res, 'notselected': !res };
  }

  changeZone(item: string) {
    this.selectedZone = item;
  }

  sendManual() {
    this.loading = true;
    const currentUser = this.localStorageService.getItem('currentUser');

    const dataToSend = [];

    if (this.data.length < 1) {
      this.alertService.error('Veuillez ajouter une donnée.');
      this.loading = false;
      return;
    }
    // console.log(currentUser);

    for (let i = 0; i < this.data.length; i++) {// } d in this.data){
      const tmp = new RainData();
      tmp.id_station = this.currentStation._id;
      tmp.id_user = currentUser.current._id;
      tmp.value = this.data[i].value;
      const d = new Date(this.data[i].date);

      // console.log(this.data[i]);
      // console.log(Number(this.data[i].time.hour));
      // console.log(Number(this.data[i].time.minute));

      tmp.date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), Number(this.data[i].time.hour), Number(this.data[i].time.minute))); // new Date(`${this.data[i].date}T${this.minTwoDigits(this.data[i].time.hour)}:${this.minTwoDigits(this.data[i].time['minute'])}:00Z`);
      // console.log(tmp.date);
      if (tmp.date.getFullYear() != 1970 && !isNaN(tmp.date.getFullYear())) {

        dataToSend.push(tmp);
      } else {
        this.alertService.error('Veuillez selectionner une date.');
        this.loading = false;
        return;
      }
    }
    // console.table(dataToSend);
    this.stationService.importData(this.currentStation._id, dataToSend).subscribe(
      res => {
        this.alertService.success('La donnée a été envoyée à un adminstrateur afin qu\'il puisse la valider.');
        this.data = [];
        this.addData();
        this.loading = false;
      },
      err => {
        this.alertService.error(err);
        this.loading = false;
      });

  }

  sendFile() {
    this.loading = true;
    const currentUser = this.localStorageService.getItem('currentUser');
    const fd = new FormData();
    if (!this.selectedFile) {
      this.alertService.error('Veuillez sélectionner un fichier.');
      this.loading = false;
      return;
    }
    fd.append('CsvFile', this.selectedFile, this.selectedFile.name);
    this.stationService.importDataFile(this.currentStation._id, fd).subscribe(
      res => {
        this.alertService.success('Le fichier a été envoyé à un adminstrateur afin qu\'il puisse le valider.');
        this.selectedFile = undefined;
        this.loading = false;
      },
      err => {
        this.alertService.error(err);
        this.loading = false;
      }
    );
  }

  private minTwoDigits(n) {
    if (!n) {
      return '00';
    }
    return (n < 10 ? '0' : '') + n;
  }

  moreData() {
    this.addData();
  }

  removeData(d) {
    const i = this.data.indexOf(d);
    if (i > -1) {
      this.data.splice(i, 1);
    }
  }


  onFileSelected($event) {
    const self = this;
    const f = <File>$event.target.files[0];
    if (f.type.toLowerCase() === 'text/csv' || f.type.toLowerCase() === 'application/vnd.ms-excel') {
      if ((f.size / 1024) > 2048) { // passer la size en ko et la comparer a 2mo en ko
        self.alertService.error('La taille max est de 2Mo');
      } else {
        self.selectedFile = f;
        //self.alertService.success('Fichier accepté');
      }
    } else {
      self.alertService.error('Seul les fichier CSV sont acceptés.');
    }

    //console.log(self.selectedFile);
  }
}
