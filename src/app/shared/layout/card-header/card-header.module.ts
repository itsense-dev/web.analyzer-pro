import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardHeaderComponent } from './card-header.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [CardHeaderComponent],
  imports: [
    CommonModule,
    NzButtonModule,
    NzPopconfirmModule,
    NzModalModule,
    PdfViewerModule,
    NzButtonModule,
    NzNotificationModule,
    NgxSpinnerModule,
    TranslocoModule,
    NzIconModule,
  ],
  exports: [CardHeaderComponent],
})
export class CardHeaderModule {}
