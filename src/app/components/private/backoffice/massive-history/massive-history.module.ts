import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MassiveHistoryRoutingModule } from './massive-history-routing.module';
import { MassiveHistoryComponent } from './massive-history.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [MassiveHistoryComponent],
  imports: [
    CommonModule,
    MassiveHistoryRoutingModule,
    NzTableModule,
    NzDividerModule,
    NzAvatarModule,
    NzSwitchModule,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoModule,
    NzModalModule,
    NzDatePickerModule,
    NzSelectModule,
    NzNotificationModule,
    NzPaginationModule,
    NgxSpinnerModule,
    NzProgressModule,
    NzSpinModule,
  ],
})
export class MassiveHistoryModule {}
