import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AndicomComponent } from './andicom.component';

const routes: Routes = [
  {
    path: '',
    component: AndicomComponent,
  },
  {
    path: 'certificate',
    loadChildren: () => import('./certificate/certificate.module').then((m) => m.CertificateModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AndicomRoutingModule {}
