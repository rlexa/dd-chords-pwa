import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {routeParamIdTrack} from './music-route';
import {MusicComponent, MusicModule} from './music.module';

const ROUTING: Routes = [
  {
    path: '',
    component: MusicComponent,
    children: [
      {
        path: `:${routeParamIdTrack}`,
        loadChildren: () => import('src/app/module/music/track/routed-track.module').then((m) => m.RoutedTrackModule),
      },
      {path: '*', redirectTo: ''},
    ],
  },
  {path: '*', redirectTo: ''},
];

@NgModule({imports: [MusicModule, RouterModule.forChild(ROUTING)]})
class RoutedMusicModule {}

export {RoutedMusicModule};
