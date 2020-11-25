import {InjectionToken, Provider} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {getPerformers$} from 'src/music/music-idb';
import {DiMusicIdbLive} from './di-music-idb';
import {DiPerformersFilter, PerformersFilter} from './di-performers-filter';

export const DiCurrentPerformers = new InjectionToken<Observable<string[]>>('Current performer list');
export const DiCurrentPerformersProvider: Provider = {
  provide: DiCurrentPerformers,
  deps: [DiMusicIdbLive, DiPerformersFilter],
  useFactory: (db$: Observable<IDBDatabase>, tracksFilter$: Observable<PerformersFilter>) =>
    combineLatest([db$, tracksFilter$]).pipe(
      switchMap(([db, query]) => getPerformers$(db, query)),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
