import {InjectionToken, Provider} from '@angular/core';
import {combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, map, shareReplay, startWith} from 'rxjs/operators';
import {idb$} from 'src/music/music-idb';

export const DiMusicIdb = new InjectionToken<Observable<IDBDatabase>>('Music IndexedDB', {
  providedIn: 'root',
  factory: () => idb$.pipe(shareReplay(1)),
});

export const DiMusicIdbChange = new InjectionToken<Subject<number>>('Music IndexedDB change stream', {
  providedIn: 'root',
  factory: () => new Subject(),
});

export const DiMusicIdbLive = new InjectionToken<Observable<IDBDatabase>>('Music IndexedDB after changes');
export const DiMusicIdbLiveProvider: Provider = {
  provide: DiMusicIdbLive,
  deps: [DiMusicIdb, DiMusicIdbChange],
  useFactory: (db$: Observable<IDBDatabase>, dbChange$: Observable<number>) =>
    combineLatest([db$, dbChange$.pipe(debounceTime(10), startWith(0))]).pipe(map(([db]) => db)),
};
