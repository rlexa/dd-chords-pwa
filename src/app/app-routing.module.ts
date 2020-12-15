import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'shared',
    loadChildren: () => import('src/app/module/shared-target/routed-shared-target.module').then((m) => m.RoutedSharedTargetModule),
  },
  {path: 'ui', loadChildren: () => import('src/app/module/dashboard/routed-dashboard.module').then((m) => m.RoutedDashboardModule)},
  {path: '', redirectTo: 'ui', pathMatch: 'full'},
  {path: '*', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
