import {inject, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {DiShowFavorites} from 'src/app/di';
import {jsonEqual} from 'src/util';
import {PerformersFilter} from './di-performers-filter';

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
