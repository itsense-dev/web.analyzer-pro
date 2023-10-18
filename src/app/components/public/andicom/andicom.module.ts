import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AndicomRoutingModule } from './andicom-routing.module';
import { AndicomComponent } from './andicom.component';
import { TranslocoModule } from '@ngneat/transloco';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GenerateReportResultModule } from '../../private/dashboard/generate-report/generate-report-result/generate-report-result.module';
import Amplify from 'aws-amplify';
import { environment } from 'src/environments/environment';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

Amplify.configure({ Auth: environment.amplifyAndicom.auth });

@NgModule({
  declarations: [AndicomComponent],
  imports: [
    CommonModule,
    AndicomRoutingModule,
    NzNotificationModule,
    NgxSpinnerModule,
    GenerateReportResultModule,
    NzPopconfirmModule,
    NzModalModule,
    PdfViewerModule,
    NzSpinModule,
    TranslocoModule,
    NzIconModule,
    NzCheckboxModule,
    AmplifyAuthenticatorModule,
    NzSkeletonModule,
  ],
})
export class AndicomModule {}
