import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { MassiveQueryDetailRoutingModule } from './massive-query-detail-routing.module';
import { MassiveQueryDetailComponent } from './massive-query-detail.component';
import { MassiveQueryDetailCardModule } from './massive-query-detail-card/massive-query-detail-card.module';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [MassiveQueryDetailComponent],
  imports: [
    CommonModule,
    MassiveQueryDetailRoutingModule,
    TranslocoModule,
    MassiveQueryDetailCardModule,
    NzPaginationModule,
    NgxSpinnerModule,
  ],
})
export class MassiveQueryDetailModule {}
