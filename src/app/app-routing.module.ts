import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './_helpers/auth.guard';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const profilModule = () => import('./profile/profile.module').then(x => x.ProfileModule);
const driverModule = () => import('./driver/driver.module').then(x => x.DriverModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: profilModule, canActivate: [AuthGuard] },
  { path: 'drivers', loadChildren: driverModule, canActivate: [AuthGuard] },
  { path: 'account', loadChildren: accountModule },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
