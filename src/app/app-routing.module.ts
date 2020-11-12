import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: 'tracks', loadChildren: () => import('src/app/module/music/music.route.module').then((m) => m.RoutedMusicModule)},
  {path: '', redirectTo: 'tracks', pathMatch: 'full'},
  {path: '*', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
