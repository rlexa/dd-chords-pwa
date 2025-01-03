import {InjectionToken, Provider} from '@angular/core';
import {Observable, combineLatest, of} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {Track} from 'src/music';
import {getTrackMetas$} from 'src/music/music-idb';
import {DiMusicIdbLive} from './di-music-idb';
import {DiTracksFilter, TracksFilter} from './di-tracks-filter';

export interface TrackMeta extends Pick<Track, 'id' | 'performer' | 'title'> {}

const emptyTracksMetaArray: TrackMeta[] = [];

export const DiCurrentTrackMetas = new InjectionToken<Observable<TrackMeta[]>>('Current track list');
export const DiCurrentTrackMetasProvider: Provider = {
  provide: DiCurrentTrackMetas,
  deps: [DiMusicIdbLive, DiTracksFilter],
  useFactory: (db$: Observable<IDBDatabase>, tracksFilter$: Observable<TracksFilter>) =>
    combineLatest([db$, tracksFilter$]).pipe(
      switchMap(([db, query]) => (!Object.keys(query).length ? of(emptyTracksMetaArray) : getTrackMetas$(db, query))),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
