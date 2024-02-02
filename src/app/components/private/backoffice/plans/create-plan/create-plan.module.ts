import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePlanComponent } from './create-plan.component';
import { RouterModule, Routes } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TranslocoModule } from '@ngneat/transloco';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

const routes: Routes = [
  {
    path: '',
    component: CreatePlanComponent,
  },
];

@NgModule({
  declarations: [CreatePlanComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzIconModule,
    NgxSpinnerModule,
    NzSpinModule,
    TranslocoModule,
    NzSelectModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzNotificationModule,
  ],
})
export class CreatePlanModule {}
