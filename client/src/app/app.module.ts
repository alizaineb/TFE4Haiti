import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppComponent} from './app.component';
import {routing} from './app.routing';
import {AlertComponent} from './_directives';
import {AuthGuard} from './_guards';
import {JwtInterceptor, ErrorInterceptor} from './_helpers';
import {AlertService, AuthenticationService, UserService} from './_services';
import {UsersComponent} from './_components/users';
import {LoginComponent} from './_components/login';
import {MenuService} from './_services/menu.service';
import {MenuComponent} from './_components/menu/menu.component';
import {FooterComponent} from './_components/footer/footer.component';
import {MapComponent} from './_components/map/map.component';
import {StationsComponent} from './_components/stations/stations.component';
import {AdminPanelComponent} from './_components/admin-panel/admin-panel.component';
import {ResetPasswordComponent} from './_components/login/reset-password/reset-password.component';
import {FaqComponent} from './_components/faq/faq.component';
import {StationsService} from './_services/stations.service';
import {AddStationModalComponent} from './_components/stations/add-station-modal/add-station-modal.component';
import {DeleteStationModalComponent} from './_components/stations/delete-station-modal/delete-station-modal.component';
import {UpdateSationModalComponent} from './_components/stations/update-sation-modal/update-sation-modal.component';
import {AskresetComponent} from './_components/login/askreset/askreset.component';
import {ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RefuseUserModalComponent} from './_components/admin-panel/refuse-user-modal/refuse-user-modal.component';
import {SimpleStationComponent} from './_components/simple-station/simple-station.component';
import {DetailsStationComponent} from './_components/simple-station/details/details-station.component';
import {LogoutComponent} from './_components/logout/logout.component';
import {NoteComponent} from './_components/simple-station/note/note.component';
import {UpdateUserModalComponent} from './_components/users/update-user-modal/update-user-modal.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {HomeComponent} from './_components/home/home.component';
import {AssignUsersComponent} from './_components/simple-station/assign-users/assign-users.component';
import {StationImportDataComponent} from './_components/stations/import-data/station-import-data.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {GraphLineComponent} from './_components/simple-station/graph-line/graph-line.component';
import {TableComponent} from './_components/simple-station/table/table.component';
import {UpdateDataModalComponent} from './_components/simple-station/table/update-data-modal/update-data-modal.component';
import {DownloadDataModalComponent} from './_components/simple-station/download-data-modal/download-data-modal.component'
;
import { NotFoundComponent } from './_components/not-found/not-found.component'

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    NgbModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    UsersComponent,
    LoginComponent,
    MenuComponent,
    FooterComponent,
    MapComponent,
    StationsComponent,
    AdminPanelComponent,
    ResetPasswordComponent,
    FaqComponent,
    AddStationModalComponent,
    DeleteStationModalComponent,
    UpdateSationModalComponent,
    AskresetComponent,
    RefuseUserModalComponent,
    SimpleStationComponent,
    DetailsStationComponent,
    LogoutComponent,
    NoteComponent,
    UpdateUserModalComponent,
    HomeComponent,
    AssignUsersComponent,
    StationImportDataComponent,
    GraphLineComponent,
    TableComponent,
    UpdateDataModalComponent,
    DownloadDataModalComponent,
    NotFoundComponent
  ],

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
