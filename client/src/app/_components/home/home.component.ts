import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import { StationsService } from '../../_services/stations.service';
import { st } from "@angular/core/src/render3";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public stations = [];

  constructor(private stationsService: StationsService) {
  }

  ngOnInit() {

    const self = this;
    this.stationsService.getAll().subscribe(result => {
      self.stations = result;
      // console.log(result);

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
      }


      self.stations.forEach(station => {

        L.marker([station.latitude, station.longitude], { icon: icon[station.state] }).bindPopup(station.name).addTo(stationGroup[station.state]);
      });

      console.table(self.stations);
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

      const map = L.map('mapid', {
        center: [19.099041, -72.658473],
        zoom: 8,
        minZoom: 8,
        maxZoom: 18,
        layers: [mapLayerOSMTopo, stationGroup.working, stationGroup.deleted, stationGroup.awaiting, stationGroup.broken]
      });

      L.control.scale().addTo(map);


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
        'Supprimée': stationGroup.deleted
      };

      L.control.layers(baseLayers, overlays).addTo(map);
    });


  }


}
