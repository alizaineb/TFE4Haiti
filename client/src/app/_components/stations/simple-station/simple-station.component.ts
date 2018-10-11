import {Component, OnDestroy, OnInit} from '@angular/core';
import {StationsService} from "../../../_services/stations.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AlertService} from "../../../_services";

@Component({
  selector: 'app-simple-station',
  templateUrl: './simple-station.component.html',
  styleUrls: ['./simple-station.component.css']
})
export class SimpleStationComponent implements OnInit, OnDestroy {

  //sub to the route
  private sub: any;

  public stationId = "";

  public tabList = ['Details', 'Tableaux', 'Graphiques', 'Notes'];
  public activeC = [false, false, false, false,]
  public activeTab = this.tabList[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stationService: StationsService,
    private alertService: AlertService
  ) {
  }

  ngOnInit() {
    const self = this;

    self.sub = self.route.params.subscribe((params) => {
      self.stationId = params['id'];
      self.activeTab = params['tab'];
      const index = self.tabList.indexOf(self.activeTab);
      if ( index < 0) {
        self.activeTab = self.tabList[0];
        self.activeC[0] = true;
        self.router.navigate(['/stations', self.stationId, self.activeTab])
      }else{
        self.activeC[index] = true
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getSelectedClass(tab) {
    return this.activeTab == tab;
  }

  selectTab(tab: string) {
    if (this.tabList.indexOf(tab) >= 0) {
      this.activeTab = tab;
    }
  }
}
