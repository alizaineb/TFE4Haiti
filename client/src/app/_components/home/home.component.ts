import {Component, OnInit} from '@angular/core';

import * as L from 'leaflet';
import {StationsService} from '../../_services/stations.service';

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

      const icon1 = L.icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/images/marker-icon.png',
        iconSize: [20, 35], // size of the icon
        iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      });
      const icon2 = L.icon({
        iconUrl: 'assets/1.png',
        iconSize: [32, 32]//, // size of the icon
        // iconAnchor: [11, 34], // point of the icon which will correspond to marker's location
        // popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
      });
      const stationHydro = L.layerGroup();

      let cpt = 0;
      self.stations.forEach(station => {
        if(cpt %2 == 0){
          L.marker([station.latitude, station.longitude], {icon: icon1}).bindPopup(station.name).addTo(stationHydro);
        }else{
          L.marker([station.latitude, station.longitude], {icon: icon2}).bindPopup(station.name).addTo(stationHydro);

        }
        cpt++;
      });

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

      const map = L.map('mapid', {
        center: [19.099041, -72.658473],
        zoom: 8,
        minZoom: 8,
        maxZoom: 18,
        layers: [mapLayer1, stationHydro]
      });

      L.control.scale().addTo(map);


      const baseLayers = {
        'Opentopomap': mapLayer1,
        'Grayscale': mapLayer2,
        'OpenStreetMap': mapLayer3
      };

      const overlays = {
        'Hydrographe': stationHydro
      };

      L.control.layers(baseLayers, overlays).addTo(map);
    });


  }


}
