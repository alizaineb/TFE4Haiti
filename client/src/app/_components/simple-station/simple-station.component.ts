import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, StationsService} from "../../_services";
import {Station} from "../../_models";

@Component({
  selector: 'app-simple-station',
  templateUrl: './simple-station.component.html',
  styleUrls: ['./simple-station.component.css']
})
export class SimpleStationComponent implements OnInit, OnDestroy {

  // sub to the route
  private sub: any;

  public stationId: string;
  public currentStation: Station;

  public tabList: string[];
  public activeTab: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stationService: StationsService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit() {
    const self = this;

    self.stationId = '';
    self.tabList = ['Details', 'Tableaux', 'Graphiques'];
    self.activeTab = self.tabList[0];

    self.sub = self.route.params.subscribe((params) => {
      self.stationId = params['id'];
      const tab = params['tab'];
      if (self.tabList.indexOf(tab) > 0) {
        self.activeTab = tab;
        self.router.navigate(['/stations', self.stationId, self.activeTab]);
      }
      if(!this.currentStation){
        this.stationService.getById(this.stationId).subscribe(
          station => {
            this.currentStation = station;
            if(this.hasViewerAccess()){
              this.tabList.push('notes');
            }
            if(this.hasAccessToStation(this.currentStation)){
              this.tabList.push('Utilisateurs');
            }
          },
          err => {
            console.log(err);
          }
        );
      }

    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.tabList=[];
  }

  getSelectedClass(tab) {
    return this.activeTab === tab;
  }

  selectTab(tab: string) {
    if (this.tabList.indexOf(tab) >= 0) {
      this.activeTab = tab;
    }
  }

  hasAccessToStation(station){
    return this.stationService.hasAccessToStation(station);
  }

  hasViewerAccess(){
    return this.authenticationService.hasViewerAccess();
  }
}
