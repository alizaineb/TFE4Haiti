import { Injectable } from '@angular/core';
import { LocalstorageService } from "./localstorage.service";

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  private currentUser;
  private bigMenuParent = {
    left: {
      all: [{name: 'Carte', path: 'map'}],
      viewer: [],
      worker: [{ name: 'Mes stations', path: 'stations' }],
      admin: [{ name: 'Gestion des Utilisateurs', path: 'users' }]
    },
    right: {
      all: [{ name: 'Se connecter', path: 'login' }],
      viewer: [{ name: 'Se déconnecter', path: 'logout' }],
      worker: [],
      admin: [{ name: 'Tableau d\'administration', path: 'admin' }]
    }
  }

  constructor(private localStorageService: LocalstorageService) {
    this.currentUser = this.localStorageService.getItem('currentUser');
  }

  getLeftAdminMenu() {
    return this.getleftWorkerMenu().concat(this.bigMenuParent.left.admin);
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
    return this.getMenuRight().concat(this.bigMenuParent.right.viewer);
  }

  getMenuRight() {
    return this.bigMenuParent.right.all;
  }
}
