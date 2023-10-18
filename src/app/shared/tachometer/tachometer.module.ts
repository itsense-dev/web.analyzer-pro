import { TranslocoModule } from '@ngneat/transloco';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TachometerComponent } from './tachometer.component';

@NgModule({
  declarations: [TachometerComponent],
  imports: [CommonModule, TranslocoModule],
  exports: [TachometerComponent],
})
export class TachometerModule {}
