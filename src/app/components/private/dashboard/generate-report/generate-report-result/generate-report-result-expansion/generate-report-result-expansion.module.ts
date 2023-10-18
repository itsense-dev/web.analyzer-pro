import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateReportResultExpansionComponent } from './generate-report-result-expansion.component';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { GenerateReportResultSourceModule } from '../generate-report-result-source/generate-report-result-source.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FilterListPipe } from './models/filter-list.pipe';
@NgModule({
  declarations: [GenerateReportResultExpansionComponent, FilterListPipe],
  imports: [
    CommonModule,
    NzCollapseModule,
    GenerateReportResultSourceModule,
    NzIconModule,
    NzNotificationModule,
    NzToolTipModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    TranslocoModule,
  ],
  exports: [GenerateReportResultExpansionComponent],
})
export class GenerateReportResultExpansionModule {}
