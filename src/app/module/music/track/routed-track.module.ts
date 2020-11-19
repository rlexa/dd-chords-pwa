import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {RoutedTrackComponent} from './routed-track.component';
import {TrackModule} from './track.module';

@NgModule({
  declarations: [RoutedTrackComponent],
  imports: [
    CommonModule,
    TrackModule,
    RouterModule.forChild([
      {path: '', component: RoutedTrackComponent, pathMatch: 'full'},
      {path: '*', redirectTo: ''},
    ]),
  ],
  exports: [RoutedTrackComponent],
})
class RoutedTrackModule {}

export {RoutedTrackModule, RoutedTrackComponent};
