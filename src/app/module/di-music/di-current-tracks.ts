import {InjectionToken, NgModule, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {Track} from 'src/music';
import {TrackService} from './track.service';

export const DiCurrentTracks = new InjectionToken<Observable<Track[]>>('Current track list');
const DiCurrentTracksProvider: Provider = {
  provide: DiCurrentTracks,
  deps: [TrackService],
  useFactory: (trackService: TrackService) => trackService.tracks$,
};

@NgModule({providers: [DiCurrentTracksProvider]})
export class DiCurrentTracksModule {}
