import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../_services/menu.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  public menu = {right: {}, left: {}};

  constructor(private  menuService: MenuService, private router: Router) {
  }

  ngOnInit() {
    this.menu.left = this.menuService.getMenuLeft();
    this.menu.right = this.menuService.getMenuRight();
  }

  itemClick(path) {
    console.log(path + ' clicked');
    this.router.navigate([path]);
  }

}
