import {inject, InjectionToken} from '@angular/core';
import {combineLatest, Observable, of} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {Track} from 'src/music';
import {getTrackMetas$} from 'src/music/music-idb';
import {DiMusicIdbLive} from './music-idb-live.di';
import {DiTracksFilter} from './tracks-filter.di';

export type TrackMeta = Pick<Track, 'id' | 'performer' | 'title'>;

const emptyTracksMetaArray: TrackMeta[] = [];

export const DiCurrentTrackMetas = new InjectionToken<Observable<TrackMeta[]>>('Current track list', {
  providedIn: 'root',
  factory: () => {
    const db$ = inject(DiMusicIdbLive);
    const tracksFilter$ = inject(DiTracksFilter);

    return combineLatest([db$, tracksFilter$]).pipe(
      switchMap(([db, query]) => (!Object.keys(query).length ? of(emptyTracksMetaArray) : getTrackMetas$(db, query))),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
