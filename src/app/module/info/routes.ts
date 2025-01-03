import {Route} from '@angular/router';
import {InfoComponent} from './info.component';

export default [
  {path: '', loadComponent: () => InfoComponent},
  {path: '**', redirectTo: ''},
] as Route[];
