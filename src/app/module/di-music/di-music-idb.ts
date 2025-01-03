import {inject, InjectionToken} from '@angular/core';
import {combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, map, shareReplay, startWith} from 'rxjs/operators';
import {idb$} from 'src/music/music-idb';

export const DiMusicIdb = new InjectionToken<Observable<IDBDatabase>>('Music IndexedDB', {
  providedIn: 'root',
  factory: () => idb$.pipe(shareReplay(1)),
});

export const DiMusicIdbChange = new InjectionToken<Subject<void>>('Music IndexedDB change stream', {
  providedIn: 'root',
  factory: () => new Subject(),
});

export const DiMusicIdbLive = new InjectionToken<Observable<IDBDatabase>>('Music IndexedDB after changes', {
  providedIn: 'root',
  factory: () => {
    const db$ = inject(DiMusicIdb);
    const dbChange$ = inject(DiMusicIdbChange);

    return combineLatest([db$, dbChange$.pipe(debounceTime(10), startWith(0))]).pipe(map(([db]) => db));
  },
});
