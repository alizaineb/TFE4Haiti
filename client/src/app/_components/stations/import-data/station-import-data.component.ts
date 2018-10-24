import {Component, OnInit} from '@angular/core';
import {Station} from "../../../_models";
import {StationsService} from "../../../_services/stations.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Data} from "../../../_models/data";
import {AlertService} from "../../../_services";
import {NgbTimepickerConfig} from "@ng-bootstrap/ng-bootstrap"
import {LocalstorageService} from "../../../_services/localstorage.service";

@Component({
  selector: 'app-import-data',
  templateUrl: './station-import-data.component.html',
  styleUrls: ['./station-import-data.component.css']
})
export class StationImportDataComponent implements OnInit {

  // sub to the route
  private sub: any;
  private loading: boolean;

  currentStation: Station;

  data: { date: string, time: { hour: number, time: number }, value: number }[];

  constructor(private stationService: StationsService,
              private localStorageService: LocalstorageService,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private configTimePicker: NgbTimepickerConfig
  ) {
    this.configTimePicker.spinners = false;
  }

  ngOnInit() {

    const self = this;
    self.loading = true;

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
      )
    });
  }

  private addData(date = "", time = {hour: 0, time: 0}, value = 0) {
    this.data.push({date: date, time: time, value: value});
  }

  sendData() {
    let dataToSend = [];
    let currentUser = this.localStorageService.getItem('currentUser');
    console.log(currentUser);

    for (let i = 0; i < this.data.length; i++) {//} d in this.data){
      let tmp = new Data();
      tmp.id_station = this.currentStation._id;
      tmp.id_user = currentUser.current._id;
      tmp.value = this.data[i].value;
      tmp.date = new Date(`${this.data[i].date}T${this.data[i].time.hour}:${this.data[i].time.time | this.data[i].time['minutes']}:00`);
      console.log(`${this.data[i].date}T${this.data[i].time.hour}:${this.data[i].time.time | this.data[i].time['minutes']}:00`);
      dataToSend.push(tmp);
    }
    console.table(dataToSend);
    this.stationService.importData(this.currentStation._id, dataToSend).subscribe(
      res => {
        this.alertService.success("données importées.");
        this.data = [];
        this.addData();
      },
      err => {
        this.alertService.error(err);
      });

  }

  moreData() {
    this.addData()
  }

  removeData(d) {
    const i = this.data.indexOf(d);
    if (i > -1) {
      this.data.splice(i, 1)
    }
  }
}
