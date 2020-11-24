import {InjectionToken, Provider} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {TracksFilter} from './di-tracks-filter';

export const DiTracksFilterQuery = new InjectionToken<Observable<string | null>>('Track filter query.', {
  providedIn: 'root',
  factory: () => new StateSubject<string | null>(null),
});

export const DiTracksFilterPartQuery = new InjectionToken<Observable<Partial<TracksFilter>>>('Track filter part.');
export const DiTracksFilterPartQueryProvider: Provider = {
  provide: DiTracksFilterPartQuery,
  deps: [DiTracksFilterQuery],
  useFactory: (query$: Observable<string>) =>
    query$.pipe(
      map<string, TracksFilter>((query) => ({query})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
