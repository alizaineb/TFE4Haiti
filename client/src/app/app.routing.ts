import {Routes, RouterModule} from '@angular/router';

import {UsersComponent} from './_components/users';
import {LoginComponent} from './_components/login';
import {AuthGuard} from './_guards';
import {HomeComponent} from "./_components/home/home.component";
import {AdminPanelComponent} from "./_components/admin-panel/admin-panel.component";
import {StationsComponent} from "./_components/stations/stations.component";
import {ResetPasswordComponent} from "./_components/login/reset-password/reset-password.component";
import {FaqComponent} from "./_components/faq/faq.component";
import {AskresetComponent} from "./_components/login/askreset/askreset.component";
import {SimpleStationComponent} from "./_components/stations/simple-station/simple-station.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard]},
  {path: 'stations', component: StationsComponent, canActivate: [AuthGuard]},
  {path: 'stations/:id', component: SimpleStationComponent},
  {path: 'stations/:id/:tab', component: SimpleStationComponent},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'login/reset', component: ResetPasswordComponent},
  {path: 'login/askreset', component: AskresetComponent},


  {path: 'faq', component: FaqComponent},


  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
