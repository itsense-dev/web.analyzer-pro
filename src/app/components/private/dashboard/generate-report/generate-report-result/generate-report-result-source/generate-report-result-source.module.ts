import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenerateReportResultSourceComponent } from './generate-report-result-source.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@NgModule({
  declarations: [GenerateReportResultSourceComponent],
  imports: [
    CommonModule,
    NzIconModule,
    NzStepsModule,
    NzTimelineModule,
    NzButtonModule,
    NzDropDownModule,
    TranslocoModule,
  ],
  exports: [GenerateReportResultSourceComponent],
})
export class GenerateReportResultSourceModule {}
