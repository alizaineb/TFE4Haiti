import {Component, OnInit} from '@angular/core';
import {Station} from "../../../_models";
import {StationsService} from "../../../_services/stations.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-import-data',
  templateUrl: './station-import-data.component.html',
  styleUrls: ['./station-import-data.component.css']
})
export class StationImportDataComponent implements OnInit {

  // sub to the route
  private sub: any;
  private loading: boolean;

  currentStation: Station;

  private data: any[];

  constructor(private stationService: StationsService,
              private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {

    const self = this;
    self.loading = true


    self.sub = self.route.params.subscribe((params) => {
      const id = params['id'];
      self.stationService.getById(id).subscribe(
        station => {
          self.currentStation = station;

          self.loading = false;
        },
        err => {

          self.loading = false;
        }
      )
    });
  }

}
