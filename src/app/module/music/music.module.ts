import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TrackImportService} from '../di-music/track-import.service';
import {MusicComponent} from './music.component';
import {PerformersModule} from './performers/performers.module';
import {TrackModule} from './track/track.module';
import {TracksModule} from './tracks/tracks.module';

@NgModule({
  declarations: [MusicComponent],
  imports: [CommonModule, RouterModule, PerformersModule, TracksModule, TrackModule],
  exports: [MusicComponent],
})
class MusicModule {
  constructor(
    // inject to make sure it imports local assets
    trackImportService: TrackImportService,
  ) {}
}

export {MusicModule, MusicComponent};
