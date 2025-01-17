import {inject, InjectionToken} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {getPerformer$} from 'src/music/music-idb';
import {DiTracksFilterPerformer} from './active';
import {DiMusicIdbLive} from './music-idb-live.di';
import {Performer} from './tracks-filter.di';

export const DiCurrentPerformer = new InjectionToken<Observable<Performer | null>>('Current performer', {
  providedIn: 'root',
  factory: () => {
    const db$ = inject(DiMusicIdbLive);
    const tracksFilterPerformer$ = inject(DiTracksFilterPerformer);

    return combineLatest([db$, tracksFilterPerformer$]).pipe(
      switchMap(([db, performerHash]) => getPerformer$(db, performerHash ?? null)),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
