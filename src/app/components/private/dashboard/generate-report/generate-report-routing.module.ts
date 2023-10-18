import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateReportComponent } from './generate-report.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateReportComponent,
  },
  {
    path: 'generate-report-result',
    loadChildren: () =>
      import('./generate-report-result/generate-report-result.module').then(
        (m) => m.GenerateReportResultModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateReportRoutingModule {}
