import {InjectionToken, Provider} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {getPerformer$} from 'src/music/music-idb';
import {DiMusicIdbLive} from './di-music-idb';
import {Performer} from './di-tracks-filter';
import {DiTracksFilterPerformer} from './di-tracks-filter-performer';

export const DiCurrentPerformer = new InjectionToken<Observable<Performer>>('Current performer');
export const DiCurrentPerformerProvider: Provider = {
  provide: DiCurrentPerformer,
  deps: [DiMusicIdbLive, DiTracksFilterPerformer],
  useFactory: (db$: Observable<IDBDatabase>, tracksFilterPerformer$: Observable<string>): Observable<Performer | null> =>
    combineLatest([db$, tracksFilterPerformer$]).pipe(
      switchMap(([db, performerHash]) => getPerformer$(db, performerHash)),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
