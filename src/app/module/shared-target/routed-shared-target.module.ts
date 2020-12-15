import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SharedTargetComponent, SharedTargetModule} from './shared-target.module';

const ROUTING: Routes = [
  {path: '', component: SharedTargetComponent},
  {path: '*', redirectTo: ''},
];

@NgModule({imports: [SharedTargetModule, RouterModule.forChild(ROUTING)]})
class RoutedSharedTargetModule {}

export {RoutedSharedTargetModule};
