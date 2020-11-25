import {InjectionToken, NgModule, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {DiPerformersFilter, PerformersFilter} from './di-performers-filter';
import {TrackService} from './track.service';

export const DiCurrentPerformers = new InjectionToken<Observable<string[]>>('Current performer list');
const DiCurrentPerformersProvider: Provider = {
  provide: DiCurrentPerformers,
  deps: [TrackService, DiPerformersFilter],
  useFactory: (trackService: TrackService, tracksFilter$: Observable<PerformersFilter>) =>
    tracksFilter$.pipe(switchMap((tracksFilter) => trackService.performers$(tracksFilter))),
};

@NgModule({providers: [DiCurrentPerformersProvider]})
export class DiCurrentPerformersModule {}
