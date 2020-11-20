import {InjectionToken, NgModule, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Track} from 'src/music';
import {sortByTitle} from 'src/music/music';
import {TrackService} from './track.service';

export interface TrackMeta extends Pick<Track, 'id' | 'performer' | 'title'> {}

export const DiCurrentTrackMetas = new InjectionToken<Observable<TrackMeta[]>>('Current track list');
const DiCurrentTrackMetasProvider: Provider = {
  provide: DiCurrentTrackMetas,
  deps: [TrackService],
  useFactory: (trackService: TrackService) =>
    trackService.tracks$.pipe(
      map((iis) =>
        iis
          .map<TrackMeta>((ii) => ({id: ii.id, performer: ii.performer, title: ii.title}))
          .sort(sortByTitle),
      ),
    ),
};

@NgModule({providers: [DiCurrentTrackMetasProvider]})
export class DiCurrentTrackMetasModule {}
