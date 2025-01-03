import {Route} from '@angular/router';
import {RouteInfo, RouteTracks} from 'src/app/routing';
import {DashboardComponent} from './dashboard.component';

export default [
  {
    path: '',
    loadComponent: () => DashboardComponent,
    children: [
      {path: RouteInfo, loadChildren: () => import('../info/routes')},
      {path: RouteTracks, loadChildren: () => import('../music/routes')},
      {path: '**', pathMatch: 'prefix', redirectTo: RouteTracks},
    ],
  },
] as Route[];
