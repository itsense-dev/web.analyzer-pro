import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { clientFilterPipe } from './models/filter_client.pipe';
import { TranslocoModule } from '@ngneat/transloco';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [ClientsComponent, clientFilterPipe],
  imports: [
    CommonModule,
    ClientsRoutingModule,
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
    TranslocoModule,
    NzModalModule,
  ],
})
export class ClientsModule {}
