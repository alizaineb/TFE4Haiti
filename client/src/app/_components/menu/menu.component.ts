import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../_services/menu.service';
import {Router} from '@angular/router';
import {LocalstorageService} from '../../_services/localstorage.service';
import {AuthenticationService} from '../../_services';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public menu = {right: [], left: []};

  constructor(private  menuService: MenuService, private router: Router, private localStorageService: LocalstorageService, private authenticationService: AuthenticationService) {

  }

  ngOnInit() {
    this.menu.left = this.menuService.getMenuLeft();
    this.menu.right = this.menuService.getMenuRight();
    let self = this;
    this.localStorageService.storage$.subscribe(storage => {
      self.updateMenu(storage);
    });
    this.updateMenu(this.localStorageService.getStorage())
  }

  private updateMenu(storage){
    const User = storage.currentUser;
    if (User && User.current) {
      let removelogin = true;
      const role = User.current.role;
      console.log('role : ', role);
      switch (role) {
        case 'admin':
          this.menu.left = this.menuService.getLeftAdminMenu();
          this.menu.right = this.menuService.getRightAdminMenu();
          break;
        case 'worker':
          this.menu.left = this.menuService.getleftWorkerMenu();
          this.menu.right = this.menuService.getRightWorkerMenu();
          break;
        case 'viewer':
          this.menu.left = this.menuService.getLeftViewerMenu();
          this.menu.right = this.menuService.getRightViewerMenu();
          break;
        default:
          removelogin = false;
          this.menu.left = this.menuService.getMenuLeft();
          this.menu.right = this.menuService.getMenuRight();
      }
      if(removelogin){
        // Ne pas déplacer le login a une autre place que la premiere,
        // La recherche de l'objet contenant le login ne fonctionne pas pour une raison que j'ignore.
        this.menu.right.splice(0, 1);
      }
      this.menu.right = this.menu.right.reverse();
    } else {
      this.menu.left = this.menuService.getMenuLeft();
      this.menu.right = this.menuService.getMenuRight();
    }
    console.log('menuleft = ', this.menu.left);
    console.log('menuRight = ', this.menu.right);
  }
  itemClick(path) {
    if (path === 'logout') {
      this.authenticationService.logout();
    }
    this.router.navigate([path]);
  }

}
