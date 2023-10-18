import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleQueryComponent } from './single-query.component';

const routes: Routes = [
  {
    path: '',
    component: SingleQueryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleQueryRoutingModule {}
