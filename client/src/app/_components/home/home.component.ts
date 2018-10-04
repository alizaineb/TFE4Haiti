import {Component, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {StationsService} from "../../_services/stations.service";

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

    let self = this;
    this.stationsService.getAll().subscribe( result => {
      self.stations = result;
      console.log(result);
    });


    const icon1 = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
      iconSize: [20, 35], // size of the icon
      iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
    });
    var cities = L.layerGroup();

    L.marker([18.299041, -73.658473], {icon: icon1}).bindPopup('Cavaillon, google Maps <a href="https://google.com">ici</a>').addTo(cities),
      L.marker([39.74, -104.99], {icon: icon1}).bindPopup('This is Denver, CO.').addTo(cities),
      L.marker([39.73, -104.8], {icon: icon1}).bindPopup('This is Aurora, CO.').addTo(cities),
      L.marker([39.77, -105.23], {icon: icon1}).bindPopup('This is Golden, CO.').addTo(cities);

    var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';


    // Maps usage : OpenStreetMap, OpenSurferMaps

    var mapLayer1 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        id: 'mapbox.light',
        attribution: mbAttr
      }),
      mapLayer2 = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        id: 'mapbox.streets',
        attribution: mbAttr
      }),
      mapLayer3 = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        id: 'mapbox.streets',
        attribution: mbAttr
      })
    ;

    var map = L.map('mapid', {
      center: [18.299041, -73.658473],
      zoom: 10,
      layers: [mapLayer1, cities]
    });

    var baseLayers = {
      "Grayscale": mapLayer1,
      "Opentopomap": mapLayer2,
      "OpenStreetMap": mapLayer3
    };

    var overlays = {
      "Cities": cities
    };

    L.control.layers(baseLayers, overlays).addTo(map);
  }


}
