import {Routes, RouterModule} from '@angular/router';

import {UsersComponent} from './_components/users';
import {LoginComponent} from './_components/login';
import {AuthGuard} from './_guards';
import {HomeComponent} from "./_components/home/home.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent},

  {path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},

  // otherwise redirect to home
  {path: '**', redirectTo: ''}
];

export const routing = RouterModule.forRoot(appRoutes);
