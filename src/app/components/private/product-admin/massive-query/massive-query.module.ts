import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MassiveQueryRoutingModule } from './massive-query-routing.module';
import { MassiveQueryComponent } from './massive-query.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  declarations: [MassiveQueryComponent],
  imports: [
    CommonModule,
    MassiveQueryRoutingModule,
    NgxSpinnerModule,
    NzButtonModule,
    NzCheckboxModule,
    NzNotificationModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoModule,
    SharedModule,
  ],
})
export class MassiveQueryModule {}
