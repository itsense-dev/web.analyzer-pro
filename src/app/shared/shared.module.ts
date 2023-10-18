import { TachometerModule } from './tachometer/tachometer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { DashboardModule } from './layout/dashboard/dashboard.module';
import { LoginModule } from './layout/login/login.module';
import { ChoosePlanModule } from './choose-plan/choose-plan.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedRoutingModule,
    DashboardModule,
    LoginModule,
    TachometerModule,
    ChoosePlanModule,
  ],
  exports: [TachometerModule, ChoosePlanModule],
})
export class SharedModule {}
