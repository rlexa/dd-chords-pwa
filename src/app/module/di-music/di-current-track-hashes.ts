import {InjectionToken, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime, shareReplay, switchMap} from 'rxjs/operators';
import {getTrackHashes$} from 'src/music/music-idb';
import {DiMusicIdbLive} from './di-music-idb';

export const DiCurrentTrackHashes = new InjectionToken<Observable<Set<string>>>('Current track hash list');
export const DiCurrentTrackHashesProvider: Provider = {
  provide: DiCurrentTrackHashes,
  deps: [DiMusicIdbLive],
  useFactory: (db$: Observable<IDBDatabase>) =>
    db$.pipe(
      debounceTime(10),
      switchMap((db) => getTrackHashes$(db)),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
