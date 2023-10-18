import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndividualHistoryRoutingModule } from './individual-history-routing.module';
import { IndividualHistoryComponent } from './individual-history.component';
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
import { querysFilterPipe } from './models/filter_querys.pipe';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [IndividualHistoryComponent, querysFilterPipe],
  imports: [
    CommonModule,
    IndividualHistoryRoutingModule,
    CommonModule,
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
    NzSpinModule,
  ],
})
export class IndividualHistoryModule {}
