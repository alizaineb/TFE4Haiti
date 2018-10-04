﻿import {Routes, RouterModule} from '@angular/router';

import {UsersComponent} from './_components/users';
import {LoginComponent} from './_components/login';
import {AuthGuard} from './_guards';
import {HomeComponent} from "./_components/home/home.component";
import {AdminPanelComponent} from "./_components/admin-panel/admin-panel.component";
import {StationsComponent} from "./_components/stations/stations.component";
import {HeatmapComponent} from "./_components/heatmap/heatmap.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'heatmap', component: HeatmapComponent},
  {path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuard]},
  {path: 'stations', component: StationsComponent, canActivate: [AuthGuard]},
  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
