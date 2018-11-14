import {Routes, RouterModule} from '@angular/router';

import {UsersComponent} from './_components/users';
import {LoginComponent} from './_components/login';
import {AuthGuard} from './_guards';
import {MapComponent} from "./_components/map/map.component";
import {AdminPanelComponent} from "./_components/admin-panel/admin-panel.component";
import {StationsComponent} from "./_components/stations/stations.component";
import {ResetPasswordComponent} from "./_components/login/reset-password/reset-password.component";
import {FaqComponent} from "./_components/faq/faq.component";
import {AskresetComponent} from "./_components/login/askreset/askreset.component";
import {SimpleStationComponent} from "./_components/simple-station/simple-station.component";
import {LogoutComponent} from "./_components/logout/logout.component";
import {HomeComponent} from "./_components/home/home.component";
import {StationImportDataComponent} from "./_components/stations/import-data/station-import-data.component";
import {NotFoundComponent} from "./_components/not-found/not-found.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'map', component: MapComponent},
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard]},
  {path: 'stations', component: StationsComponent, canActivate: [AuthGuard]},
  {path: 'stations/:id', component: SimpleStationComponent},
  {path: 'stations/:id/import', component: StationImportDataComponent},
  {path: 'stations/:id/:tab', component: SimpleStationComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'login/reset/:f/:id', component: ResetPasswordComponent},
  {path: 'login/askreset', component: AskresetComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'not-found', component: NotFoundComponent},


  {path: 'faq', component: FaqComponent},


  // otherwise redirect to home
  {path: '**', redirectTo: 'not-found'}
];

export const routing = RouterModule.forRoot(appRoutes);
