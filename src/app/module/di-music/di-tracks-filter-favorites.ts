import {inject, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {DiShowFavorites} from './di-show-favorites';
import {TracksFilter} from './di-tracks-filter';

export const DiTracksFilterPartFavorites = new InjectionToken<Observable<Partial<TracksFilter>>>('Tracks filter part.', {
  providedIn: 'root',
  factory: () => {
    const favorites$ = inject(DiShowFavorites);

    return favorites$.pipe(
      map((favorites): TracksFilter => ({favorites})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
