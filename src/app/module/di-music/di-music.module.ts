import {NgModule} from '@angular/core';
import {DiCurrentPerformersProvider} from './di-current-performers';
import {DiCurrentTrackHashesProvider} from './di-current-track-hashes';
import {DiCurrentTrackMetasProvider} from './di-current-tracks';
import {DiMusicIdbLiveProvider} from './di-music-idb';
import {DiPerformersFilterModule} from './di-performers-filter.module';
import {DiTracksFilterModule} from './di-tracks-filter.module';
import {TrackImportService} from './track-import.service';
import {TrackService} from './track.service';

@NgModule({
  imports: [DiPerformersFilterModule, DiTracksFilterModule],
  providers: [
    DiMusicIdbLiveProvider,
    DiCurrentPerformersProvider,
    DiCurrentTrackHashesProvider,
    DiCurrentTrackMetasProvider,
    TrackService,
    TrackImportService,
  ],
})
export class DiMusicModule {}
