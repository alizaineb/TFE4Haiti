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
import * as L from 'leaflet';
import {LatLng} from 'leaflet';
import {Constantes} from "../../../_helpers/constantes";
import {MatDatepickerInputEvent} from "@angular/material";

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

  states: string[];
  communes: string[];
  bassin_versants: string[];
  submitted = false;

  updateStationForm: FormGroup;

  map;
  mark;

  constructor(private alertService: AlertService,
              private stationService: StationsService) {
  }

  ngOnInit(): void {
    this.stationService.getCommunes().subscribe(communes => {this.communes = communes; });
    this.stationService.getBassin_versants().subscribe(bassin_versants => {this.bassin_versants = bassin_versants; });
    this.initForm();
    this.initDatePickerAndMap();
    this.states = [Constantes.stationState.AWAITING, Constantes.stationState.BROKEN, Constantes.stationState.DELETED, Constantes.stationState.WORKING];
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
      'state': new FormControl(this.stationToUpdate.state, [
        Validators.required
      ]),
      'commune': new FormControl(this.stationToUpdate.commune, [
        Validators.required
      ]),
      'bassin_versant': new FormControl(this.stationToUpdate.bassin_versant, [
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
  get state() { return this.updateStationForm.get('state'); }
  get createdAt() {return this.updateStationForm.get('createdAt'); }
  get altitude() {return this.updateStationForm.get('altitude'); }
  get bassin_versant() {return this.updateStationForm.get('bassin_versant'); }
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
    s.state = this.updateStationForm.controls['state'].value;
    s.createdAt = this.updateStationForm.controls['createdAt'].value;
    s.bassin_versant = this.updateStationForm.controls['bassin_versant'].value;
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

    const mapLayerOSMGrayScale = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        attribution: mbAttr
      }),
      mapLayerOpenStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
      }),
      mapLayerErsiWorlStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
      }),
      mapLayerErsiSatelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      mapLayerHyddaFull = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

    const baseLayers = {
      'OSM - Grayscale': mapLayerOSMGrayScale,
      'OSM - TopoMap': mapLayerOpenStreetMap,
      'Ersi - WorldStreetMap': mapLayerErsiWorlStreetMap,
      'Ersi - Satelite': mapLayerErsiSatelite,
      'Hydda - Full': mapLayerHyddaFull
    };

    this.map = L.map('mapid2', {
      center: [19.099041, -72.658473],
      zoom: 7,
      minZoom: 7,
      maxZoom: 18,
      layers: [mapLayerOpenStreetMap]
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


