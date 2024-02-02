import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'clients',
    loadChildren: () => import('./clients/clients.module').then((m) => m.ClientsModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then((m) => m.ProductsModule),
  },
  {
    path: 'individual-history',
    loadChildren: () =>
      import('./individual-history/individual-history.module').then(
        (m) => m.IndividualHistoryModule
      ),
  },
  {
    path: 'massive-history',
    loadChildren: () =>
      import('./massive-history/massive-history.module').then((m) => m.MassiveHistoryModule),
  },
  {
    path: 'plans',
    loadChildren: () => import('./plans/plans.module').then((m) => m.PlansModule),
  },
  {
    path: 'subscriptions',
    loadChildren: () =>
      import('./subscription/subscription.module').then((m) => m.SubscriptionModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackofficeRoutingModule {}
