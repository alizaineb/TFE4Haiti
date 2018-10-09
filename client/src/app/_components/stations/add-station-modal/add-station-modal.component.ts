import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {first} from "rxjs/operators";
import {AlertService} from "../../../_services";
import {StationsService} from "../../../_services/stations.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Station} from "../../../_models";
import flatpickr from "flatpickr";
import { French} from "flatpickr/dist/l10n/fr";
import * as L from "leaflet";
import {LatLng} from "leaflet";


@Component({
  selector: 'app-add-station-modal',
  templateUrl: './add-station-modal.component.html',
  styleUrls: ['./add-station-modal.component.css']
})
export class AddStationModalComponent implements OnInit{


  @Output()
  sent = new EventEmitter<boolean>();

  intervals = ['1min','5min','10min','15min','30min','1h','2h','6h','12h','24h'];
  station:Station;
  submitted = false;

  addStationForm:FormGroup;
  datePicker;

  constructor(private alertService:AlertService,
              private stationService:StationsService){

  }

  ngOnInit(): void {
    this.station = new Station('','',undefined,undefined,'',null, new Date(),'',[]);

    this.addStationForm = new FormGroup({
      'name': new FormControl(this.station.name, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      'latitude': new FormControl(this.station.latitude, [
        Validators.required,
        Validators.max(90),
        Validators.min(-90)
      ]),
      'longitude': new FormControl(this.station.longitude, [
        Validators.required,
        Validators.max(180),
        Validators.min(-180)
      ]),
      'interval': new FormControl(this.station.interval, [
        Validators.required
      ]),
      'createdAt': new FormControl(this.station.createdAt, [
        Validators.required
      ])
    });


    this.datePicker = flatpickr("#createdAt", {
      defaultDate: this.station.createdAt,
      locale:French,
      altInput: true,
      altFormat: "d-m-Y",
      dateFormat: "d-m-Y"
    });

    const icon1 = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
      iconSize: [20, 35], // size of the icon
      iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
    });
    const stationHydro = L.layerGroup();

    const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';


    // Maps usage : OpenStreetMap, OpenSurferMaps

    const mapLayer2 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
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

    const overlays = {
      'Hydrographe': stationHydro
    };

    const map = L.map('mapid', {
      center: [19.099041, -72.658473],
      zoom: 8,
      minZoom: 8,
      maxZoom: 18,
      layers: [mapLayer1, stationHydro]
    });

    L.control.scale().addTo(map);
    L.control.layers(baseLayers, overlays).addTo(map);
    map.on('click', function(e){
      // @ts-ignore
      let latln:LatLng = e.latlng;
      let mark = L.marker([latln.lat, latln.lng], {icon: icon1}).addTo(map);


    });
  }

  updateCreatedDate(){
    this.station.createdAt = new Date(this.datePicker.selectedDates[0]);
  }

  get name() { return this.addStationForm.get('name'); }
  get latitude() { return this.addStationForm.get('latitude'); }
  get longitude() { return this.addStationForm.get('longitude'); }
  get interval() { return this.addStationForm.get('interval'); }
  get createdAt() {return this.addStationForm.get('createdAt');}


  onSubmit() { this.submitted = true; }

  resetStation() {
    this.station = new Station('','',undefined,undefined,'',null, new Date(),'',[]);
    this.datePicker.setDate(new Date())
  }

  sendStation(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.addStationForm.invalid) {
      return;
    }
    this.stationService.register(this.station)
      .pipe(first())
      .subscribe(
        result => {
          //trigger sent
          this.sent.emit(true);
          //Fermer la page
          this.resetStation();
          let element: HTMLElement = document.getElementsByClassName('btn')[1] as HTMLElement;
          element.click();
        },
        error => {
          this.alertService.error(error);
        });
  }
}

