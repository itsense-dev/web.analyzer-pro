import { UserInfoModule } from './user-info/user-info.module';
import { SharedModule } from './../../../../shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardClientComponent } from './dashboard-client.component';
import { QueriesMonitorModule } from './queries-monitor/queries-monitor.module';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  declarations: [DashboardClientComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    SharedModule,
    QueriesMonitorModule,
    UserInfoModule,
    NzNotificationModule,
  ],
  exports: [DashboardClientComponent],
})
export class DashboardClientModule {}
