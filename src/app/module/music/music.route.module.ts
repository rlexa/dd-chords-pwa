import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MusicComponent, MusicModule} from './music.module';

const ROUTING: Routes = [
  {path: '', component: MusicComponent, pathMatch: 'full'},
  {path: '*', redirectTo: ''},
];

@NgModule({imports: [MusicModule, RouterModule.forChild(ROUTING)]})
class RoutedMusicModule {}

export {RoutedMusicModule};
