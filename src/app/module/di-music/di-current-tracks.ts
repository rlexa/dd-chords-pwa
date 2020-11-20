import {InjectionToken, NgModule, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Track} from 'src/music';
import {sortTracks} from 'src/music/music';
import {TrackService} from './track.service';

export const DiCurrentTracks = new InjectionToken<Observable<Track[]>>('Current track list');
const DiCurrentTracksProvider: Provider = {
  provide: DiCurrentTracks,
  deps: [TrackService],
  useFactory: (trackService: TrackService) => trackService.tracks$.pipe(map((iis) => iis.sort(sortTracks))),
};

@NgModule({providers: [DiCurrentTracksProvider]})
export class DiCurrentTracksModule {}
