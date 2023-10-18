import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassiveQueryDetailComponent } from './massive-query-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MassiveQueryDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassiveQueryDetailRoutingModule {}
