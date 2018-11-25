import { Component, OnInit } from '@angular/core';

import * as L from 'leaflet';
import { StationsService } from '../../_services/stations.service';
import { Station } from "../../_models";
import { LocalstorageService } from "../../_services/localstorage.service";
import { Constantes } from '../../_helpers/constantes'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public allStations = [];
  private selectedStation = [];
  public filteredStation = [];
  private mapContainer;
  private zoom = 8;
  private centerMap = [19.099041, -72.658473];
  communes: string[];
  bassin_versants: string[];

  private communeFilter: string;
  private bassin_versantFilter: string;
  private term: string;

  constructor(
    private localStorageService: LocalstorageService,
    private stationsService: StationsService
  ) {
  }

  ngOnInit() {
    this.stationsService.getCommunes().subscribe(communes => {
      this.communes = communes;
    });
    this.stationsService.getBassin_versants().subscribe(bassin_versants => {
      this.bassin_versants = bassin_versants;
    });
    const self = this;
    this.stationsService.getAll().subscribe(result => {
      self.selectedStation = result.slice(0); //make a clone
      self.allStations = result.slice(0);
      self.filteredStation = result.slice(0).sort(this.compareStation);
      self.generateMap();
    });


  }

  compareStation(a: Station, b: Station) {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()) {
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
    for (let i = 0; i < self.selectedStation.length; i++) {
      station = self.selectedStation[i];
      ['/stations', station._id, 'Details']
      L.marker([station.latitude, station.longitude], { icon: icon[station.state] }).bindPopup(`<b><a href="/stations/${station._id}/Details">${station.name}</a> </b><br/>`).addTo(stationGroup[station.state]);
    }

    // console.table(self.selectedStation);
    const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

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



    const currentU = this.localStorageService.getStorage()['currentUser'];
    self.mapContainer = L.map('mapid', {
      center: [self.centerMap[0], self.centerMap[1]],
      zoom: self.zoom,
      minZoom: 8,
      maxZoom: 18,
      layers: [mapLayerOpenStreetMap, stationGroup.working, stationGroup.deleted, stationGroup.awaiting, stationGroup.broken]
    });



    L.control.scale().addTo(self.mapContainer);

    let legend = L.control.attribution({ position: 'bottomright' });

    legend.onAdd = function(map) {

      var div = L.DomUtil.create('div', 'info legend'),
        grades = ['En activité', 'En panne', 'Pas en activitée'],
        color = ['#5cd65c', '#ffb84d', '#ff471a'];

      if (currentU) {
        grades.push('A valider');
        color.push('#1aa3ff');
      }
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
      'OSM - Grayscale': mapLayerOSMGrayScale,
      'OSM - TopoMap': mapLayerOpenStreetMap,
      'Ersi - WorldStreetMap': mapLayerErsiWorlStreetMap,
      'Ersi - Satelite': mapLayerErsiSatelite,
      'Hydda - Full': mapLayerHyddaFull
    };



    const overlays = {
      'Fonctionnelle': stationGroup.working,
      'En panne': stationGroup.broken,
      'A valider': stationGroup.awaiting,
      'Supprimee': stationGroup.deleted
    };

    if (!currentU) {
      self.mapContainer.removeLayer(stationGroup.awaiting);
      self.mapContainer.removeLayer(overlays);
      L.control.layers(baseLayers).addTo(self.mapContainer);
      self.filteredStation = self.allStations.filter(station => {
        return station.state.toLowerCase() != Constantes.stationState.AWAITING.toLowerCase()
      })
    } else {
      L.control.layers(baseLayers, overlays).addTo(self.mapContainer);
    }

    self.mapContainer.on('zoomend', (e) => {
      self.zoom = e.target._animateToZoom;
    });

    self.mapContainer.on('moveend', (e) => {
      const center = self.mapContainer.getBounds().getCenter()
      self.centerMap = [center.lat, center.lng];
    });

    self.mapContainer.on('baselayerchange', (e) => {
      //console.log('maps layer change', e.layer)
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

  communeSelected(val) {
    this.communeFilter = val;
    this.applyFilter();
  }

  communeEmpty(val) {
    if (val.length == 0) {
      this.communeFilter = val;
      this.applyFilter();
    }
  }

  bassin_versantSelected(val) {
    this.bassin_versantFilter = val;
    this.applyFilter();
  }

  bassin_versantEmpty(val) {
    if (val.length == 0) {
      this.bassin_versantFilter = val;
      this.applyFilter();
    }
  }

  filterStation(event) {
    console.log("hello");
    this.term = event.target.value;
    //console.log(term)
    this.applyFilter();
  }

  applyFilter() {
    this.filteredStation = this.allStations;
    if (this.communeFilter) {
      this.filteredStation = this.filteredStation.filter((value) => {
        return value.commune.toLowerCase().includes(this.communeFilter.toLowerCase());
      });
    }
    if (this.bassin_versantFilter) {
      this.filteredStation = this.filteredStation.filter((value) => {
        return value.bassin_versant.toLowerCase().includes(this.bassin_versantFilter.toLowerCase());
      });
    }
    if (this.term) {
      this.filteredStation = this.filteredStation.filter((value) => {
        return value.name.toLowerCase().includes(this.term.toLowerCase());
      });
    }

    this.filteredStation = this.filteredStation.sort(this.compareStation)
  }
}
