import {NgModule} from '@angular/core';
import {DiCurrentPerformersProvider} from './di-current-performers';
import {DiCurrentTrackMetasProvider} from './di-current-tracks';
import {DiMusicIdbLiveProvider} from './di-music-idb';
import {DiPerformersFilterModule} from './di-performers-filter.module';
import {DiTracksFilterModule} from './di-tracks-filter.module';
import {TrackService} from './track.service';

@NgModule({
  imports: [DiPerformersFilterModule, DiTracksFilterModule],
  providers: [DiMusicIdbLiveProvider, DiCurrentPerformersProvider, DiCurrentTrackMetasProvider, TrackService],
})
export class DiMusicModule {}
