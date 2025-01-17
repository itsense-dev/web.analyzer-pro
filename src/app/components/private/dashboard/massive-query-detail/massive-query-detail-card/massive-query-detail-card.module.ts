import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MassiveQueryDetailCardComponent } from './massive-query-detail-card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [MassiveQueryDetailCardComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    NzButtonModule,
    NzIconModule,
    NzProgressModule,
    NzDividerModule,
  ],
  exports: [MassiveQueryDetailCardComponent],
})
export class MassiveQueryDetailCardModule {}
