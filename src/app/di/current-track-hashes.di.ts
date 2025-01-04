import {inject, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, shareReplay, switchMap} from 'rxjs/operators';
import {getTrackHashes$} from 'src/music/music-idb';
import {DiMusicIdbLive} from './music-idb-live.di';

export const DiCurrentTrackHashes = new InjectionToken<Observable<Set<string>>>('Current track hash list', {
  providedIn: 'root',
  factory: () => {
    const db$ = inject(DiMusicIdbLive);

    return db$.pipe(debounceTime(10), switchMap(getTrackHashes$), shareReplay({refCount: true, bufferSize: 1}));
  },
});
