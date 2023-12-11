import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivateAccountRoutingModule } from './activate-account-routing.module';
import { ActivateAccountComponent } from './activate-account.component';
import { TranslocoModule } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  declarations: [ActivateAccountComponent],
  imports: [
    CommonModule,
    AmplifyAuthenticatorModule,
    ActivateAccountRoutingModule,
    TranslocoModule,

    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzNotificationModule,
    NzAlertModule,
  ],
})
export class ActivateAccountModule {}
