import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DriverRoutingModule } from './driver-routing.module';
import { DriverComponent } from './driver.component';
import { LayoutComponent } from './layout.component';


@NgModule({
  declarations: [
    DriverComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    DriverRoutingModule
  ]
})
export class DriverModule { }
