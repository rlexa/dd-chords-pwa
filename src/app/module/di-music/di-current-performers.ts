import {InjectionToken, NgModule, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {TrackService} from './track.service';

export const DiCurrentPerformers = new InjectionToken<Observable<string[]>>('Current performer list');
const DiCurrentPerformersProvider: Provider = {
  provide: DiCurrentPerformers,
  deps: [TrackService],
  useFactory: (trackService: TrackService) =>
    trackService.tracks$.pipe(map((iis) => iis.map<string>((ii) => ii.performer || '???').sort())),
};

@NgModule({providers: [DiCurrentPerformersProvider]})
export class DiCurrentPerformersModule {}
