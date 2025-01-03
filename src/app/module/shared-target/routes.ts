import {Route} from '@angular/router';
import {SharedTargetComponent} from './shared-target.component';

export default [
  {path: '', loadComponent: () => SharedTargetComponent},
  {path: '**', redirectTo: ''},
] as Route[];
