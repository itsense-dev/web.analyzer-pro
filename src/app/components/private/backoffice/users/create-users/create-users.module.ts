import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUsersRoutingModule } from './create-users-routing.module';
import { CreateUsersComponent } from './create-users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslocoModule } from '@ngneat/transloco';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { environment } from 'src/environments/environment';
import Amplify from 'aws-amplify';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

Amplify.configure({ Auth: environment.amplify.auth });

@NgModule({
  declarations: [CreateUsersComponent],
  imports: [
    CommonModule,
    CreateUsersRoutingModule,
    NzFormModule,
    ReactiveFormsModule,
    FormsModule,
    NzSwitchModule,
    NzSelectModule,
    TranslocoModule,
    NzGridModule,
    NzCheckboxModule,
    NzButtonModule,
    AmplifyAuthenticatorModule,
    NzAvatarModule,
  ],
  exports: [CreateUsersComponent],
})
export class CreateUsersModule {}
