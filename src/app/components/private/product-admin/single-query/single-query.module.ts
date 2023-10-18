import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { SharedModule } from './../../../../shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleQueryComponent } from './single-query.component';
import { SingleQueryRoutingModule } from './single-query-routing.module';

@NgModule({
  declarations: [SingleQueryComponent],
  imports: [
    CommonModule,
    SingleQueryRoutingModule,
    TranslocoModule,
    SharedModule,
    NzNotificationModule,
  ],
})
export class SingleQueryModule {}
