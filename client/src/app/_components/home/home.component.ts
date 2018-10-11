import {Component, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {StationsService} from '../../_services/stations.service';
import {st} from "@angular/core/src/render3";
import {Station} from "../../_models";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public allStations = [];
  private selectedStation = [];
  public filteredStation = [];
  private mapContainer;
  private zoom = 8;
  private centerMap = [19.099041, -72.658473];

  constructor(private stationsService: StationsService) {
  }

  ngOnInit() {

    const self = this;
    this.stationsService.getAll().subscribe(result => {
      self.selectedStation = result.slice(0); //make a clone
      self.allStations = result.slice(0);
      self.filteredStation = result.slice(0).sort(this.compareStation);
      self.generateMap();
    });


  }

  compareStation(a: Station, b: Station){
    if(a.name.toLowerCase() < b.name.toLowerCase()){
      return -1;
    }
    if(a.name.toLowerCase() > b.name.toLowerCase()){
      return 1;
    }
    return 0;
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


    const stationGroup = {
      working: L.layerGroup(),
      awaiting: L.layerGroup(),
      broken: L.layerGroup(),
      deleted: L.layerGroup()
    };


    let station;
    for(let i=0; i < self.selectedStation.length; i++){
      station = self.selectedStation[i];
      L.marker([station.latitude, station.longitude], {icon: icon[station.state]}).bindPopup(`<b>${station.name} </b><br/>`).addTo(stationGroup[station.state]);
    }
    // self.selectedStation.forEach(station => {
    //
    //
    // });

    console.table(self.selectedStation);
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

    self.mapContainer = L.map('mapid', {
      center: [self.centerMap[0], self.centerMap[1]],
      zoom: self.zoom,
      minZoom: 8,
      maxZoom: 18,
      layers: [mapLayerOSMGrayScale, stationGroup.working, stationGroup.deleted, stationGroup.awaiting, stationGroup.broken]
    });


    L.control.scale().addTo(self.mapContainer);

    let legend = L.control.attribution({position: 'bottomright'});

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = ['OK', 'En panne', 'Supprimée', 'A valider'],
        color = ['#5cd65c', '#ffb84d', '#ff471a', '#1aa3ff'];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
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

    const overlays = {
      'Fonctionnelle': stationGroup.working,
      'En panne': stationGroup.broken,
      'A valider': stationGroup.awaiting,
      'Supprimee': stationGroup.deleted
    };


    L.control.layers(baseLayers, overlays).addTo(self.mapContainer);
    self.mapContainer.on('zoomend', (e) => {
      self.zoom = e.target._animateToZoom;
    });

    self.mapContainer.on('moveend', (e) => {
      const center = self.mapContainer.getBounds().getCenter()
      self.centerMap = [center.lat, center.lng];
    });

    self.mapContainer.on('baselayerchange', (e) => {
      console.log('maps layer change', e.layer)
    })


  }

  getSelectedClass(station) {
    if (this.selectedStation.length == this.allStations.length) {
      return false;
    }
    return this.selectedStation.indexOf(station) >= 0;
  }


  toogleSelectionFor(station) {
    const self = this;
    if (self.selectedStation.length == self.allStations.length) {
      self.selectedStation = [];
    }
    const index = self.selectedStation.indexOf(station);
    if (index == -1) {
      self.selectedStation.push(station);
      self.centerMap = [station.latitude, station.longitude];
    } else {
      self.selectedStation.splice(index, 1);
      if (this.selectedStation.length == 0) {
        self.zoom = 8;
        self.centerMap = [19.099041, -72.658473];
        self.selectedStation = self.allStations.slice(0);
      }
    }

    self.generateMap();

  }

  filterStation(event) {
    const term = event.target.value;
    console.log(term)

    this.filteredStation = this.allStations.filter((value) => {
      // return value.name.toLowerCase().startsWith(term.toLowerCase());
      return value.name.toLowerCase().includes(term.toLowerCase());
    });
    this.filteredStation = this.filteredStation.sort(this.compareStation)
    // console.table(this.filteredStation)

  }
}
