import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LocalstorageService} from "../_services/localstorage.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private localStorageService: LocalstorageService){

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.localStorageService.getItem('currentUser');
    if(request.url.toLowerCase().includes('importFile'.toLowerCase())){
      request = request.clone({
        setHeaders: {
          'x-access-token': currentUser.token
        }
      });
    }else{
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: {
            'x-access-token': currentUser.token,
            'Content-Type': 'application/json'
          }
        });
      }
    }


    return next.handle(request);
  }
}
