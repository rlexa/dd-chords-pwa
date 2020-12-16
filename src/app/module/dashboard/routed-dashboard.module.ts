import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent, DashboardModule} from './dashboard.module';
import {routeTracks} from './routed-dashboard';

const ROUTING: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {path: 'info', loadChildren: () => import('src/app/module/info/routed-info.module').then((m) => m.RoutedInfoModule)},
      {path: routeTracks, loadChildren: () => import('src/app/module/music/routed-music.module').then((m) => m.RoutedMusicModule)},
      {path: '', redirectTo: routeTracks, pathMatch: 'full'},
      {path: '*', redirectTo: ''},
    ],
  },
];

@NgModule({imports: [DashboardModule, RouterModule.forChild(ROUTING)]})
class RoutedDashboardModule {}

export {RoutedDashboardModule};
