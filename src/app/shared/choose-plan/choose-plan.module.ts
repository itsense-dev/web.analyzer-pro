import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoosePlanComponent } from './choose-plan.component';
import { TranslocoModule } from '@ngneat/transloco';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [ChoosePlanComponent],
  imports: [CommonModule, TranslocoModule, NzButtonModule],
  exports: [ChoosePlanComponent],
})
export class ChoosePlanModule {}
