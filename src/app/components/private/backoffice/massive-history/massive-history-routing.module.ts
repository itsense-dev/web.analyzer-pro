import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassiveHistoryComponent } from './massive-history.component';

const routes: Routes = [
  {
    path: '',
    component: MassiveHistoryComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassiveHistoryRoutingModule {}
