import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, NzLayoutModule],
  exports: [LoginComponent],
})
export class LoginModule {}
