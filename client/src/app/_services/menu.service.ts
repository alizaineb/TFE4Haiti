import {Injectable} from '@angular/core';
import {LocalstorageService} from "./localstorage.service";

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  private currentUser;
  private bigMenuParent = {
    left: {
      all: [{name: 'Heatmap', path: 'heatmap'}],
      viewer: [],
      worker: [{name: 'Stations', path: 'stations'}],
      admin: [{name: 'Users', path: 'users'}]
    },
    right: {
      all: [{name: 'Login', path: 'login'}],
      viewer: [{name: 'Logout', path: 'logout'}],
      worker: [],
      admin: [{name: 'Dashboard', path: 'admin'}]
    }
  }

  constructor(private localStorageService: LocalstorageService) {
    this.currentUser = this.localStorageService.getItem('currentUser');
  }

  getLeftAdminMenu() {
    return this.getleftWorkerMenu().concat(this.bigMenuParent.left.admin).reverse();
  }

  getleftWorkerMenu() {
    return this.getLeftViewerMenu().concat(this.bigMenuParent.left.worker);
  }

  getLeftViewerMenu() {
    return this.getMenuLeft().concat(this.bigMenuParent.left.viewer);
  }

  getMenuLeft() {
    return this.bigMenuParent.left.all;
  }

  getRightAdminMenu() {
    return this.getRightWorkerMenu().concat(this.bigMenuParent.right.admin);
  }

  getRightWorkerMenu() {
    return this.getRightViewerMenu().concat(this.bigMenuParent.right.worker);
  }

  getRightViewerMenu() {
    let allTab = this.getMenuRight();
    allTab.splice(0, 1);
    return allTab.concat(this.bigMenuParent.right.viewer);
  }

  getMenuRight() {
    return this.bigMenuParent.right.all;
  }
}
