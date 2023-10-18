import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateReportResultComponent } from './generate-report-result.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateReportResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateReportResultRoutingModule {}
