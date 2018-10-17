import {Component, Input, OnInit} from '@angular/core';
import {StationsService} from '../../../_services/stations.service';
import {AlertService} from '../../../_services/';
import * as L from 'leaflet';
import {Station} from '../../../_models';

@Component({
  selector: 'app-simple-station-details',
  templateUrl: './details-station.component.html',
  styleUrls: ['./details-station.component.css']
})
export class DetailsStationComponent implements OnInit {

  @Input()
  private stationId: string;

  public currentStation;
  private mapContainer;

  constructor(
    private stationService: StationsService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    const self = this;
    this.stationService.getById(this.stationId).subscribe(
      station => {
        self.currentStation = station;
        self.generateMap();
      },
      err => {
        self.alertService.error(err);
      }
    );
    console.log('details init', this.stationId);
  }

  toNiceDate(date) {
    date = new Date(date);
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear() + ' à ' + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  }

  getState(station: Station) {
    return this.stationService.getFrenchState(station);
  }

  generateMap() {
    const self = this;

    if (self.mapContainer) {
      self.mapContainer.off();
      self.mapContainer.remove();
    }

    const icon = {
      working: L.icon({
        iconUrl: 'assets/img/marker-working.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      }),
      awaiting: L.icon({
        iconUrl: 'assets/img/marker-wait.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      }),
      broken: L.icon({
        iconUrl: 'assets/img/marker-broken.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      }),
      deleted: L.icon({
        iconUrl: 'assets/img/marker-delete.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      })
    };


    const stationGroup = L.layerGroup();



    L.marker([self.currentStation.latitude, self.currentStation.longitude], {icon: icon[self.currentStation.state]}).bindPopup(`<b>${self.currentStation.name} </b><br/>`).addTo(stationGroup);


    const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';


    // Maps usage : OpenStreetMap, OpenSurferMaps

    const mapLayerOSMGrayScale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        id: 'mapbox.light',
        attribution: mbAttr
      }),
      mapLayerOSMTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        id: 'mapbox.streets',
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


    self.mapContainer = L.map('mapId', {
      center: [self.currentStation.latitude, self.currentStation.longitude],
      zoom: 12,
      minZoom: 8,
      maxZoom: 18,
      layers: [mapLayerOSMGrayScale, stationGroup]
    });
    console.log('coucou2');


    L.control.scale().addTo(self.mapContainer);

    const legend = L.control.attribution({position: 'bottomright'});

    legend.onAdd = function (map) {

      const div = L.DomUtil.create('div', 'info legend'),
        grades = ['OK', 'En panne', 'Supprimée', 'A valider'],
        color = ['#5cd65c', '#ffb84d', '#ff471a', '#1aa3ff'];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + color[i] + '"></i> ' +
          grades[i] + '<br>';
      }

      return div;
    };

    legend.addTo(self.mapContainer);

    const baseLayers = {
      'OpenStreetMap': mapLayerOpenStreetMap,
      'OSM - Opentopomap': mapLayerOSMTopo,
      'OSM - Grayscale': mapLayerOSMGrayScale,
      'Ersi WorldStreetMap': mapLayerErsiWorlStreetMap,
      'Ersi - Satelite': mapLayerErsiSatelite,
      'Hydda - Full': mapLayerHyddaFull
    };

    L.control.layers(baseLayers).addTo(self.mapContainer);
  }

}
