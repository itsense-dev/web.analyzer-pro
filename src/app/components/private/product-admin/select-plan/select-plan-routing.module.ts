import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectPlanComponent } from './select-plan.component';

const routes: Routes = [
  {
    path: '',
    component: SelectPlanComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPlanRoutingModule {}
