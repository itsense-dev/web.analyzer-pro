import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateReportResultNotfoundComponent } from './generate-report-result-notfound.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TranslocoModule } from '@ngneat/transloco';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { GenerateReportResultSourceModule } from '../generate-report-result-source/generate-report-result-source.module';

@NgModule({
  declarations: [GenerateReportResultNotfoundComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzCollapseModule,
    NzIconModule,
    NzNotificationModule,
    NzToolTipModule,
    TranslocoModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    GenerateReportResultSourceModule,
  ],
  exports: [GenerateReportResultNotfoundComponent],
})
export class GenerateReportResultNotfoundModule {}
