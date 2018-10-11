import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-simple-station',
  templateUrl: './simple-station.component.html',
  styleUrls: ['./simple-station.component.css']
})
export class SimpleStationComponent implements OnInit, OnDestroy {

  //sub to the route
  private sub: any;

  public stationId: string;

  public tabList: string[];
  public activeTab: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    const self = this;

    self.stationId = "";
    self.tabList = ['Details', 'Tableaux', 'Graphiques', 'Notes'];
    self.activeTab = self.tabList[0];

    self.sub = self.route.params.subscribe((params) => {
      self.stationId = params['id'];
      self.activeTab = params['tab'];
      if (self.tabList.indexOf(self.activeTab) < 0) {
        self.activeTab = self.tabList[0];
        self.router.navigate(['/stations', self.stationId, self.activeTab])
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
