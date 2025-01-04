import {inject, InjectionToken} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {DiMusicIdbChange} from './active';
import {DiMusicIdb} from './music-idb.di';

export const DiMusicIdbLive = new InjectionToken<Observable<IDBDatabase>>('Music IndexedDB after changes', {
  providedIn: 'root',
  factory: () => {
    const db$ = inject(DiMusicIdb);
    const dbChange$ = inject(DiMusicIdbChange);

    return combineLatest([db$, dbChange$.pipe(debounceTime(10), startWith(0))]).pipe(map(([db]) => db));
  },
});
