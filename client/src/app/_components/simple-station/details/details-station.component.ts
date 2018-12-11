import { Component, Input, OnInit } from '@angular/core';
import { StationsService } from '../../../_services/stations.service';
import { AlertService, AuthenticationService } from '../../../_services/';
import * as L from 'leaflet';
import { Station } from '../../../_models';
import { LocalstorageService } from "../../../_services/localstorage.service";

@Component({
  selector: 'app-simple-station-details',
  templateUrl: './details-station.component.html',
  styleUrls: ['./details-station.component.css']
})
export class DetailsStationComponent implements OnInit {

  @Input()
  private stationId: string;

  public currentStation: Station;
  private mapContainer;

  public DownloadData: boolean;

  constructor(
    private stationService: StationsService,
    private localStorageService: LocalstorageService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.DownloadData = false;
    this.loadData();
  }

  setDownloadClick() {
    this.DownloadData = !this.DownloadData;
  }

  loadData() {
    this.stationService.getById(this.stationId).subscribe(
      station => {
        this.currentStation = station;
        //console.log(this.currentStation);
        this.generateMap();
      },
      err => {
        this.alertService.error(err);
      }
    );
  }

  downloadData(event) {
    const self = this;
    self.DownloadData = false;
    //console.log("download", event.dates);
    event.dates.to.setHours(event.dates.to.getHours() + 24);
    const params = {
      from: self.preFormatDate(event.dates.from),
      to: self.preFormatDate(event.dates.to),
      interval: event.interval
    }
    //console.log(params);
    self.stationService.downloadData(self.currentStation._id, params).subscribe(
      res => {
        self.alertService.success('Un email vous sera envoyé dès que le fichier sera prêt.');
      },
      err => {
        self.alertService.error(err);
      }
    );
  }

  preFormatDate(date: Date) {
    // console.log(date);
    return `${date.getFullYear()}-${this.minTwoDigits(date.getMonth() + 1)}-${this.minTwoDigits(date.getDate())}`;
  }

  minTwoDigits(n) {
    return (n < 10 ? '0' : '') + n;
  }

  reloadStation($event = null) {
    this.loadData();
  }


  hasAccessToStation(station) {
    return this.stationService.hasAccessToStation(station);
  }

  hasViewerAcces() {
    return this.authenticationService.hasViewerAccess();
  }
  hasAdminAccess() {
    return this.authenticationService.hasAdminAccess();
  }


  generateMap() {
    const self = this;

    if (self.mapContainer) {
      self.mapContainer.off();
      self.mapContainer.remove();
    }

    const icon = {
      'En activité': L.icon({
        iconUrl: 'assets/img/marker-working.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      }),
      'En attente': L.icon({
        iconUrl: 'assets/img/marker-wait.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      }),
      'En panne': L.icon({
        iconUrl: 'assets/img/marker-broken.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      }),
      'Pas en activité': L.icon({
        iconUrl: 'assets/img/marker-delete.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      })
    };


    const stationGroup = L.layerGroup();


    L.marker([self.currentStation.latitude, self.currentStation.longitude], { icon: icon[self.currentStation.state] }).bindPopup(`<b>${self.currentStation.name} </b><br/>`).addTo(stationGroup);


    const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';


    const mapLayerOSMGrayScale = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
      attribution: mbAttr
    }),
      mapLayerOpenStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
      }),
      mapLayerErsiSatelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      mapLayerHyddaFull = L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: 'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

    const currentU = this.localStorageService.getStorage()['currentUser'];
    self.mapContainer = L.map('mapId', {
      center: [self.currentStation.latitude, self.currentStation.longitude],
      zoom: 10,
      minZoom: 8,
      maxZoom: 18,
      layers: [mapLayerOpenStreetMap, stationGroup]
    });

    L.control.scale().addTo(self.mapContainer);

    const legend = L.control.attribution({ position: 'bottomright' });

    legend.onAdd = function(map) {

      const div = L.DomUtil.create('div', 'info legend'),
        grades = ['En activité', 'En panne', 'Pas en activité'],
        color = ['#5cd65c', '#ffb84d', '#ff471a', '#1aa3ff'];

      if (currentU) {
        grades.push('A valider');
        color.push('#1aa3ff');
      }
      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + color[i] + '"></i> ' +
          grades[i] + '<br>';
      }

      return div;
    };

    /*

          'OSM - Opentopomap': mapLayerOSMTopo,
     */
    legend.addTo(self.mapContainer);
    const baseLayers = {
      'OSM - Grayscale': mapLayerOSMGrayScale,
      'OpenStreetMap': mapLayerOpenStreetMap,
      'Ersi - Satelite': mapLayerErsiSatelite,
      'Hydda - Full': mapLayerHyddaFull
    };


    L.control.layers(baseLayers).addTo(self.mapContainer);
  }

}
