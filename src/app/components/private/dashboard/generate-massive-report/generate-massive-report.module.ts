import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateMassiveReportRoutingModule } from './generate-massive-report-routing.module';
import { GenerateMassiveReportComponent } from './generate-massive-report.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@NgModule({
  declarations: [GenerateMassiveReportComponent],
  imports: [
    CommonModule,
    GenerateMassiveReportRoutingModule,
    TranslocoModule,
    NzRadioModule,
    FormsModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzIconModule,
    NzButtonModule,
    NgxSpinnerModule,
    NzSpinModule,
  ],
})
export class GenerateMassiveReportModule {}
