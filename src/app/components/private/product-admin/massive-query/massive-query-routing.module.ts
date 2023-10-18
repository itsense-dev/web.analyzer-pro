import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassiveQueryComponent } from './massive-query.component';

const routes: Routes = [
  {
    path: '',
    component: MassiveQueryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassiveQueryRoutingModule {}
