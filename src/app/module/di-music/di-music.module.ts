import {Inject, NgModule} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CacheService} from '../common/cache/cache.service';
import {DiCurrentPerformerProvider} from './di-current-performer';
import {DiCurrentPerformersProvider} from './di-current-performers';
import {DiCurrentTrackCountProvider} from './di-current-track-count';
import {DiCurrentTrackHashesProvider} from './di-current-track-hashes';
import {DiCurrentTrackMetasProvider} from './di-current-tracks';
import {DiMusicIdbLiveProvider} from './di-music-idb';
import {DiPerformersFilterModule} from './di-performers-filter.module';
import {DiShowChords} from './di-show-chords';
import {DiShowFavorites} from './di-show-favorites';
import {DiTracksFilterModule} from './di-tracks-filter.module';
import {TrackImportService} from './track-import.service';
import {TrackService} from './track.service';

@NgModule({
  imports: [DiPerformersFilterModule, DiTracksFilterModule],
  providers: [
    DiMusicIdbLiveProvider,
    DiCurrentPerformerProvider,
    DiCurrentPerformersProvider,
    DiCurrentTrackHashesProvider,
    DiCurrentTrackCountProvider,
    DiCurrentTrackMetasProvider,
    TrackService,
    TrackImportService,
  ],
})
export class DiMusicModule {
  constructor(
    cacheService: CacheService,
    @Inject(DiShowChords) showChords$: BehaviorSubject<boolean>,
    @Inject(DiShowFavorites) showFavorites$: BehaviorSubject<boolean>,
  ) {
    cacheService.register('showChords', showChords$, (val) => showChords$.next(val ?? showChords$.value));
    cacheService.register('showFavorites', showFavorites$, (val) => showFavorites$.next(val ?? showFavorites$.value));
  }
}
