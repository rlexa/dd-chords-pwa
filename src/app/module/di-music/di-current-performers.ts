import {inject, InjectionToken} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {getPerformers$} from 'src/music/music-idb';
import {DiMusicIdbLive} from './di-music-idb';
import {DiPerformersFilter} from './di-performers-filter';
import {Performer} from './di-tracks-filter';

export const DiCurrentPerformers = new InjectionToken<Observable<Performer[]>>('Current performer list', {
  providedIn: 'root',
  factory: () => {
    const db$ = inject(DiMusicIdbLive);
    const performersFilter$ = inject(DiPerformersFilter);

    return combineLatest([db$, performersFilter$]).pipe(
      switchMap(([db, query]) => getPerformers$(db, query)),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
