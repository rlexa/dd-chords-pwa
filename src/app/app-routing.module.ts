import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {routeShared, routeUi} from './app-routing';

const routes: Routes = [
  {
    path: routeShared,
    loadChildren: () => import('src/app/module/shared-target/routed-shared-target.module').then((m) => m.RoutedSharedTargetModule),
  },
  {path: routeUi, loadChildren: () => import('src/app/module/dashboard/routed-dashboard.module').then((m) => m.RoutedDashboardModule)},
  {path: '', redirectTo: routeUi, pathMatch: 'full'},
  {path: '*', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
