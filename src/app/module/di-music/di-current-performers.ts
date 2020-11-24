import {InjectionToken, NgModule, Provider} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Track} from 'src/music';
import {DiPerformersFilter, PerformersFilter} from './di-performers-filter';
import {TrackService} from './track.service';

const trackToPerformer = (track: Track): string => track?.performer || '???';

const queryStringValue = (queryBy: string | undefined, value: string | undefined): boolean =>
  !queryBy || !!value?.toLocaleLowerCase().includes(queryBy.toLocaleLowerCase());

const filterPerformer = (trackFilter: PerformersFilter) => (performer: string) => queryStringValue(trackFilter.query, performer);

export const DiCurrentPerformers = new InjectionToken<Observable<string[]>>('Current performer list');
const DiCurrentPerformersProvider: Provider = {
  provide: DiCurrentPerformers,
  deps: [TrackService, DiPerformersFilter],
  useFactory: (trackService: TrackService, tracksFilter$: Observable<PerformersFilter>) =>
    combineLatest([trackService.tracks$, tracksFilter$]).pipe(
      map(([tracks, tracksFilter]) => [...new Set(tracks.map(trackToPerformer))].filter(filterPerformer(tracksFilter)).sort()),
    ),
};

@NgModule({providers: [DiCurrentPerformersProvider]})
export class DiCurrentPerformersModule {}
