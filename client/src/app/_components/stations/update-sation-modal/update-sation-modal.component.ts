import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {Station} from '../../../_models';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../../_services';
import {StationsService} from '../../../_services/stations.service';
import flatpickr from 'flatpickr';
import {French} from 'flatpickr/dist/l10n/fr';
import * as L from 'leaflet';
import {LatLng} from 'leaflet';

@Component({
  selector: 'app-update-sation-modal',
  templateUrl: './update-sation-modal.component.html',
  styleUrls: ['./update-sation-modal.component.css']
})
export class UpdateSationModalComponent implements OnInit, AfterViewChecked, OnChanges {

  @Input()
  stationToUpdate: Station;

  @Output()
  updated = new EventEmitter<boolean>();

  intervals: string[];
  communes: string[];
  rivers: string[];
  submitted = false;

  updateStationForm: FormGroup;
  datePicker;

  map;
  mark;

  constructor(private alertService: AlertService,
              private stationService: StationsService) {
  }

  ngOnInit(): void {
    this.stationService.getIntervals().subscribe(intervals => {this.intervals = intervals; });
    this.stationService.getCommunes().subscribe(communes => {this.communes = communes; });
    this.stationService.getRivers().subscribe(rivers => {this.rivers = rivers; });
    this.initForm();
    this.initDatePickerAndMap();
  }


  initForm() {
    this.updateStationForm = new FormGroup({
      'name': new FormControl(this.stationToUpdate.name, [
        Validators.required,
        Validators.maxLength(20)
      ]),

      'latitude': new FormControl(this.stationToUpdate.latitude, [
        Validators.required,
        Validators.max(90),
        Validators.min(-90)
      ]),
      'longitude': new FormControl(this.stationToUpdate.longitude, [
        Validators.required,
        Validators.max(180),
        Validators.min(-180)
      ]),
      'altitude': new FormControl(this.stationToUpdate.altitude, [
        Validators.max(10000),
        Validators.min(0)
      ]),
      'interval': new FormControl(this.stationToUpdate.interval, [
        Validators.required
      ]),
      'commune': new FormControl(this.stationToUpdate.commune, [
        Validators.required
      ]),
      'river': new FormControl(this.stationToUpdate.river, [
        Validators.required
      ]),
      'createdAt': new FormControl(this.stationToUpdate.createdAt, [
        Validators.required
      ])
      // Ajouter la méthode get en dessous pour chaque field
    });
  }

  get name() { return this.updateStationForm.get('name'); }
  get latitude() { return this.updateStationForm.get('latitude'); }
  get longitude() { return this.updateStationForm.get('longitude'); }
  get interval() { return this.updateStationForm.get('interval'); }
  get createdAt() {return this.updateStationForm.get('createdAt'); }
  get altitude() {return this.updateStationForm.get('altitude'); }
  get river() {return this.updateStationForm.get('river'); }
  get commune() {return this.updateStationForm.get('commune'); }

  ngAfterViewChecked(): void {
    this.map.invalidateSize();
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
    if (this.updateStationForm.invalid) {
      return;
    }

    const s = new Station();
    s._id = this.stationToUpdate._id;
    s.name = this.updateStationForm.controls['name'].value;
    s.latitude = this.updateStationForm.controls['latitude'].value;
    s.longitude = this.updateStationForm.controls['longitude'].value;
    s.altitude = this.updateStationForm.controls['altitude'].value;
    s.interval = this.updateStationForm.controls['interval'].value;
    s.createdAt = this.updateStationForm.controls['createdAt'].value;
    s.river = this.updateStationForm.controls['river'].value;
    s.commune = this.updateStationForm.controls['commune'].value;

    this.stationService.update(s)
      .subscribe(
        result => {
          // trigger sent
          this.updated.emit(true);
          this.alertService.success('La station a été modifiée');
        },
        error => {
          this.alertService.error(error);
        });
  }

  initDatePickerAndMap() {
    const self = this;
    this.datePicker = flatpickr('#createdAt2', {
      defaultDate: self.stationToUpdate.createdAt,
      locale: French,
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y',
      onChange: function(selectedDates, dateStr, instance) {
        self.updateStationForm.controls['createdAt'].setValue(new Date(selectedDates[0]));
      }
    });

    const icon1 = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
      iconSize: [20, 35], // size of the icon
      iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
    });

    const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';


    // Maps usage : OpenStreetMap, OpenSurferMaps

    const mapLayer2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.ey' +
      'J1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        id: 'mapbox.light',
        attribution: mbAttr
      }),
      mapLayer1 = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        id: 'mapbox.streets',
        attribution: mbAttr
      }),
      mapLayer3 = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        id: 'mapbox.streets',
        attribution: mbAttr
      }) ;

    const baseLayers = {
      'Grayscale': mapLayer1,
      'Opentopomap': mapLayer2,
      'OpenStreetMap': mapLayer3
    };

    this.map = L.map('mapid2', {
      center: [19.099041, -72.658473],
      zoom: 7,
      minZoom: 7,
      maxZoom: 18,
      layers: [mapLayer1]
    });

    L.control.scale().addTo(this.map);
    L.control.layers(baseLayers).addTo(this.map);

    self.mark = L.marker([self.stationToUpdate.latitude, self.stationToUpdate.longitude], {icon: icon1}).addTo(self.map);

    this.map.on('click', function(e) {
      // @ts-ignore
      const latln: LatLng = e.latlng;
      self.updateStationForm.controls['latitude'].setValue(latln.lat);
      self.updateStationForm.controls['longitude'].setValue(latln.lng);
      self.mark.setLatLng(latln);
    });
  }
}


