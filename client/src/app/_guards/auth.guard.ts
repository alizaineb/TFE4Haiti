import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {LocalstorageService} from "../_services/localstorage.service";
import {AuthenticationService} from "../_services";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private localStorageService: LocalstorageService, private authService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Promise<boolean>{
    return new Promise<boolean>((resolve => {
      this.authService.isLogged().toPromise().then(
        value => {
          resolve(true)
        },
        err => {
          this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
          resolve(false);
        }
      )
    }))

  }
}
