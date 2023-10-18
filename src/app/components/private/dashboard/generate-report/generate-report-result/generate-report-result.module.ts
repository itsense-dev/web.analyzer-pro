import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateReportResultRoutingModule } from './generate-report-result-routing.module';
import { GenerateReportResultComponent } from './generate-report-result.component';
import { CardHeaderModule } from 'src/app/shared/layout/card-header/card-header.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { GenerateReportResultExpansionModule } from './generate-report-result-expansion/generate-report-result-expansion.module';
import { GenerateReportResultNotfoundModule } from './generate-report-result-notfound/generate-report-result-notfound.module';

@NgModule({
  declarations: [GenerateReportResultComponent],
  imports: [
    CommonModule,
    GenerateReportResultRoutingModule,
    CardHeaderModule,
    GenerateReportResultExpansionModule,
    GenerateReportResultNotfoundModule,
    NzButtonModule,
    NzTabsModule,
    TranslocoModule,
  ],
  exports: [GenerateReportResultComponent],
})
export class GenerateReportResultModule {}
