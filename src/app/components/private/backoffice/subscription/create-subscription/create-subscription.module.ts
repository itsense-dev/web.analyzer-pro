import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateSubscriptionComponent } from './create-subscription.component';
import { RouterModule, Routes } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslocoModule } from '@ngneat/transloco';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgxMaskModule } from 'ngx-mask';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

const routes: Routes = [
  {
    path: '',
    component: CreateSubscriptionComponent,
  },
];

@NgModule({
  declarations: [CreateSubscriptionComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NzIconModule,
    NgxSpinnerModule,
    NzSpinModule,
    TranslocoModule,
    NzSelectModule,
    NzButtonModule,
    NzCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    NzNotificationModule,
    NzDatePickerModule,
    NgxMaskModule.forRoot(),
  ],
})
export class CreateSubscriptionModule {}
