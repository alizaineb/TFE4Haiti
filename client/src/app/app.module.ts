import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

// used to create fake backend

import {AppComponent} from './app.component';
import {routing} from './app.routing';

import {AlertComponent} from './_directives';
import {AuthGuard} from './_guards';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {AlertService, AuthenticationService, UserService} from './_services';
import {UsersComponent} from './_components/users';
import {LoginComponent} from './_components/login';
import {MenuService} from "./_services/menu.service";
import {MenuComponent} from './_components/menu/menu.component';

import {FooterComponent} from './_components/footer/footer.component';

import {HomeComponent} from './_components/home/home.component'  ;
import {HeatmapComponent} from './_components/heatmap/heatmap.component'  ;
import {StationsComponent} from './_components/stations/stations.component' ;
import {AdminPanelComponent} from './_components/admin-panel/admin-panel.component';

;
import {ResetPasswordComponent} from './_components/login/reset-password/reset-password.component'
;
import { FaqComponent } from './_components/faq/faq.component'
import {StationsService} from "./_services/stations.service";
@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    UsersComponent,
    LoginComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    HeatmapComponent,
    StationsComponent,
    AdminPanelComponent,
    ResetPasswordComponent
,
    FaqComponent  ],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    StationsService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},

    MenuService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
