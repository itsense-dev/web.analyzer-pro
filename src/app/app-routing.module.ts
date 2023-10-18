import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './shared/layout/login/login.component';
import { DashboardComponent } from './shared/layout/dashboard/dashboard.component';
import { SessionGuard } from './guards/session/session.guard';
import { ProtectedRoutesGuard } from './guards/protected-routes/protected-routes.guard';

const routes: Routes = [
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./components/public/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
    component: LoginComponent,
  },
  {
    path: 'login',
    loadChildren: () => import('./components/public/login/login.module').then((m) => m.LoginModule),
    component: LoginComponent,
  },

  {
    path: 'dashboard',
    canActivate: [SessionGuard, ProtectedRoutesGuard],
    loadChildren: () =>
      import('./components/private/dashboard/dashboard.module').then((m) => m.DashboardModule),
    component: DashboardComponent,
  },
  {
    path: 'product-admin',
    canActivate: [SessionGuard, ProtectedRoutesGuard],
    loadChildren: () =>
      import('./components/private/product-admin/product-admin.module').then(
        (m) => m.ProductAdminModule
      ),
    component: DashboardComponent,
  },
  {
    path: 'andicom',
    loadChildren: () =>
      import('./components/public/andicom/andicom.module').then((m) => m.AndicomModule),
  },
  {
    path: 'backoffice',
    canActivate: [SessionGuard, ProtectedRoutesGuard],
    loadChildren: () =>
      import('./components/private/backoffice/backoffice.module').then((m) => m.BackofficeModule),
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
