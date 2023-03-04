import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'user/:id', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
