import {AfterViewChecked, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AlertService} from '../../../_services';
import {StationsService} from '../../../_services/stations.service';
import {NoteService} from '../../../_services/note.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Note, Station} from '../../../_models';
import flatpickr from 'flatpickr';
import { French} from 'flatpickr/dist/l10n/fr';
import * as L from 'leaflet';
import {LatLng} from 'leaflet';


@Component({
  selector: 'app-add-station-modal',
  templateUrl: './add-station-modal.component.html',
  styleUrls: ['./add-station-modal.component.css']
})
export class AddStationModalComponent implements OnInit, AfterViewChecked {


  @Output()
  sent = new EventEmitter<boolean>();
  submitted = false;
  addStationForm: FormGroup;
  datePicker;
  map;
  mark;
  intervals: string[];
  communes: string[];
  rivers: string[];

  constructor(private alertService: AlertService,
              private stationService: StationsService,
              private noteService: NoteService) {
  }

  ngOnInit(): void {
    this.stationService.getIntervals().subscribe(intervals => {this.intervals = intervals; });
    this.stationService.getCommunes().subscribe(communes => {this.communes = communes; });
    this.stationService.getRivers().subscribe(rivers => {this.rivers = rivers; });
    this.addStationForm = new FormGroup({

      'name': new FormControl('', [
        Validators.required,
        Validators.maxLength(20)
      ]),

      'latitude': new FormControl(undefined, [
        Validators.required,
        Validators.max(90),
        Validators.min(-90)
      ]),
      'longitude': new FormControl(undefined, [
        Validators.required,
        Validators.max(180),
        Validators.min(-180)
      ]),
      'altitude': new FormControl(undefined, [
        Validators.max(10000),
        Validators.min(0)
      ]),
      'interval': new FormControl('', [
        Validators.required
      ]),
      'commune': new FormControl('', [
        Validators.required
      ]),
      'river': new FormControl('', [
        Validators.required
      ]),
      'createdAt': new FormControl(null, [
        Validators.required
      ]),
      'note': new FormControl('', [
        Validators.maxLength(200)
      ])
      // Ajouter la méthode get è
    });
    this.initDatePickerAndMap();
  }

  get name() { return this.addStationForm.get('name'); }
  get latitude() { return this.addStationForm.get('latitude'); }
  get longitude() { return this.addStationForm.get('longitude'); }
  get interval() { return this.addStationForm.get('interval'); }
  get createdAt() {return this.addStationForm.get('createdAt'); }
  get altitude() {return this.addStationForm.get('altitude'); }
  get note() {return this.addStationForm.get('note'); }
  get river() {return this.addStationForm.get('river'); }
  get commune() {return this.addStationForm.get('commune'); }

  ngAfterViewChecked(): void {
    this.map.invalidateSize();
  }

  onSubmit() { this.submitted = true; }

  resetStation() {
    this.addStationForm.reset();
    this.datePicker.setDate(null);
    this.map.removeLayer(this.mark);
  }

  sendStation() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addStationForm.invalid) {
      return;
    }

    const s = new Station();
    s.name = this.addStationForm.controls['name'].value;
    s.latitude = this.addStationForm.controls['latitude'].value;
    s.longitude = this.addStationForm.controls['longitude'].value;
    s.altitude = this.addStationForm.controls['altitude'].value;
    s.interval = this.addStationForm.controls['interval'].value;
    s.river = this.addStationForm.controls['river'].value;
    s.commune = this.addStationForm.controls['commune'].value;
    s.createdAt = this.addStationForm.controls['createdAt'].value;

    this.stationService.register(s)
      .subscribe(
        newStation => {
          if (this.addStationForm.controls['note'].value !== '') {
            const n = new Note();
            n.station_id = newStation._id;
            n.note = this.addStationForm.controls['note'].value;
            this.noteService.register(n)
              .subscribe(
                newNote => {
              },
              error => {
                this.alertService.error('La note n\'a pas été ajoutér\n' + error);
              });
          }
          this.resetStation();
          // trigger sent
          this.sent.emit(true);
          this.alertService.success('La station a été ajoutée');
        },
        error => {
          this.alertService.error(error);
        });
  }

  initDatePickerAndMap() {
    const self = this;
    this.datePicker = flatpickr('#createdAtAdd', {
      locale: French,
      altInput: true,
      altFormat: 'd-m-Y',
      dateFormat: 'd-m-Y',
      onChange: function(selectedDates, dateStr, instance) {
        self.addStationForm.controls['createdAt'].setValue(new Date(selectedDates[0]));
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

    const mapLayer2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYS' +
      'I6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
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


    this.map = L.map('mapid', {
      center: [19.099041, -72.658473],
      zoom: 7,
      minZoom: 7,
      maxZoom: 18,
      layers: [mapLayer1]
    });

    L.control.scale().addTo(this.map);
    L.control.layers(baseLayers).addTo(this.map);

/*    if (self.station.latitude != undefined && self.station.latitude != undefined) {
      self.mark = L.marker([self.station.latitude, self.station.longitude], {icon: icon1}).addTo(self.map);
    }else {
      this.mark = L.marker([0, 0], {icon: icon1});
    }*/

    this.mark = L.marker([0, 0], {icon: icon1});
    this.map.on('click', function(e) {
      // @ts-ignore
      const latln: LatLng = e.latlng;
      self.addStationForm.controls['latitude'].setValue(latln.lat);
      self.addStationForm.controls['longitude'].setValue(latln.lng);
      self.mark.setLatLng(latln);
      self.mark.addTo(self.map);
    });
  }
}



