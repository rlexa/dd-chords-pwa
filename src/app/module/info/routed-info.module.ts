import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoComponent, InfoModule} from './info.module';

const ROUTING: Routes = [
  {path: '', component: InfoComponent},
  {path: '*', redirectTo: ''},
];

@NgModule({imports: [InfoModule, RouterModule.forChild(ROUTING)]})
class RoutedInfoModule {}

export {RoutedInfoModule};
