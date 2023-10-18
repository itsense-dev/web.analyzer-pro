import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassiveQueryComponent } from './massive-query/massive-query.component';

const routes: Routes = [
  {
    path: 'select-plan',
    loadChildren: () => import('./select-plan/select-plan.module').then((m) => m.SelectPlanModule),
  },
  {
    path: 'massive-query',
    loadChildren: () =>
      import('./massive-query/massive-query.module').then((m) => m.MassiveQueryModule),
  },
  {
    path: 'single-query',
    loadChildren: () =>
      import('./single-query/single-query.module').then((m) => m.SingleQueryModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductAdminRoutingModule {}
