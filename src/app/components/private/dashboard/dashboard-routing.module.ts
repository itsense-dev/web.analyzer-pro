import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'generate-report',
    loadChildren: () =>
      import('./generate-report/generate-report.module').then((m) => m.GenerateReportModule),
  },
  {
    path: 'generate-massive-report',
    loadChildren: () =>
      import('./generate-massive-report/generate-massive-report.module').then(
        (m) => m.GenerateMassiveReportModule
      ),
  },
  {
    path: 'massive-query-detail',
    loadChildren: () =>
      import('./massive-query-detail/massive-query-detail.module').then(
        (m) => m.MassiveQueryDetailModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
