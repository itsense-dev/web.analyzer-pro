import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlansComponent } from './plans.component';

const routes: Routes = [
  {
    path: '',
    component: PlansComponent,
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./create-plan/create-plan.module').then((module) => module.CreatePlanModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlansRoutingModule {}
