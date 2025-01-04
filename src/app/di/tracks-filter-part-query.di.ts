import {inject, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {DiTracksFilterQuery} from './active';
import {TracksFilter} from './tracks-filter.di';

export const DiTracksFilterPartQuery = new InjectionToken<Observable<Partial<TracksFilter>>>('Track filter part.', {
  providedIn: 'root',
  factory: () => {
    const query$ = inject(DiTracksFilterQuery);

    return query$.pipe(
      map((query) => ({query})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
