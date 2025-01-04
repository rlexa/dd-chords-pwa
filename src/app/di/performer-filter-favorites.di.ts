import {inject, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {DiShowFavorites} from './active';
import {PerformersFilter} from './performers-filter.di';

export const DiPerformersFilterPartFavorites = new InjectionToken<Observable<Partial<PerformersFilter>>>('Performers filter part.', {
  providedIn: 'root',
  factory: () => {
    const favorites$ = inject(DiShowFavorites);

    return favorites$.pipe(
      map((favorites): PerformersFilter => ({favorites})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
