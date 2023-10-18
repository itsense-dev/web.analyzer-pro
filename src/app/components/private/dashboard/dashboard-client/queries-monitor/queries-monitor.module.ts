import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueriesMonitorComponent } from './queries-monitor.component';

@NgModule({
  declarations: [QueriesMonitorComponent],
  imports: [CommonModule, TranslocoModule],
  exports: [QueriesMonitorComponent],
})
export class QueriesMonitorModule {}
