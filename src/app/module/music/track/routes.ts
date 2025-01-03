import {Route} from '@angular/router';
import {RoutedTrackComponent} from './routed-track.component';

export default [
  {path: '', loadComponent: () => RoutedTrackComponent},
  {path: '**', redirectTo: ''},
] as Route[];
