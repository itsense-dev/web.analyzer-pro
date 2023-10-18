import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectPlanRoutingModule } from './select-plan-routing.module';
import { SelectPlanComponent } from './select-plan.component';

@NgModule({
  declarations: [SelectPlanComponent],
  imports: [CommonModule, SelectPlanRoutingModule],
})
export class SelectPlanModule {}
