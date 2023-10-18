import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenerateReportRoutingModule } from './generate-report-routing.module';
import { GenerateReportComponent } from './generate-report.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NgxMaskModule } from 'ngx-mask';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GenerateReportResultModule } from './generate-report-result/generate-report-result.module';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { TranslocoModule } from '@ngneat/transloco';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

@NgModule({
  declarations: [GenerateReportComponent],
  imports: [
    CommonModule,
    GenerateReportRoutingModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NgxMaskModule.forRoot(),
    NzButtonModule,
    NzNotificationModule,
    NgxSpinnerModule,
    GenerateReportResultModule,
    NzPopconfirmModule,
    NzModalModule,
    PdfViewerModule,
    NzSpinModule,
    TranslocoModule,
    NzRadioModule,
    NzIconModule,
    NzCheckboxModule,
  ],
})
export class GenerateReportModule {}
