import {Route} from '@angular/router';
import {RouteParamIdTrack} from 'src/app/routing';
import {MusicComponent} from './music.component';

export default [
  {
    path: '',
    loadComponent: () => MusicComponent,
    children: [
      {path: `:${RouteParamIdTrack}`, loadChildren: () => import('./track/routes')},
      {path: '**', redirectTo: ''},
    ],
  },
  {path: '**', redirectTo: ''},
] as Route[];
