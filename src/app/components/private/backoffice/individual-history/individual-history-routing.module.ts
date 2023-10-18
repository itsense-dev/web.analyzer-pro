import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualHistoryComponent } from './individual-history.component';

const routes: Routes = [
  {
    path: '',
    component: IndividualHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndividualHistoryRoutingModule {}
