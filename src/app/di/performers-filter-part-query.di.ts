import {inject, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {DiPerformersFilterQuery} from './active';
import {PerformersFilter} from './performers-filter.di';

export const DiPerformersFilterPartQuery = new InjectionToken<Observable<Partial<PerformersFilter>>>('Performers filter part.', {
  providedIn: 'root',
  factory: () => {
    const query$ = inject(DiPerformersFilterQuery);

    return query$.pipe(
      map((query): PerformersFilter => ({query})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
