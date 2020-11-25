import {InjectionToken, NgModule, Provider} from '@angular/core';
import {Observable, of} from 'rxjs';
import {shareReplay, switchMap} from 'rxjs/operators';
import {Track} from 'src/music';
import {DiTracksFilter, TracksFilter} from './di-tracks-filter';
import {TrackService} from './track.service';

export interface TrackMeta extends Pick<Track, 'id' | 'performer' | 'title'> {}

const emptyTracksMetaArray: TrackMeta[] = [];

export const DiCurrentTrackMetas = new InjectionToken<Observable<TrackMeta[]>>('Current track list');
const DiCurrentTrackMetasProvider: Provider = {
  provide: DiCurrentTrackMetas,
  deps: [TrackService, DiTracksFilter],
  useFactory: (trackService: TrackService, tracksFilter$: Observable<TracksFilter>) =>
    tracksFilter$.pipe(
      switchMap((tracksFilter) => (!Object.keys(tracksFilter).length ? of(emptyTracksMetaArray) : trackService.trackMetas$(tracksFilter))),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};

@NgModule({providers: [DiCurrentTrackMetasProvider]})
export class DiCurrentTrackMetasModule {}
