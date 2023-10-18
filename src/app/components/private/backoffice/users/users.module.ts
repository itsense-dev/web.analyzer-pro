import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { usersFilterPipe } from './models/filter-users.pipe';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { TranslocoModule } from '@ngneat/transloco';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { CreateUsersModule } from './create-users/create-users.module';

@NgModule({
  declarations: [UsersComponent, usersFilterPipe],
  imports: [
    CommonModule,
    UsersRoutingModule,
    NzDropDownModule,
    NzTableModule,
    NzDividerModule,
    NzAvatarModule,
    NzSwitchModule,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
    NzIconModule,
    ReactiveFormsModule,
    FormsModule,
    NzSelectModule,
    TranslocoModule,
    NzModalModule,
    NzDescriptionsModule,
    CreateUsersModule,
  ],
})
export class UsersModule {}
