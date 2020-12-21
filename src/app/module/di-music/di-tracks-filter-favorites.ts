import {InjectionToken, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {DiShowFavorites} from './di-show-favorites';
import {TracksFilter} from './di-tracks-filter';

export const DiTracksFilterPartFavorites = new InjectionToken<Observable<Partial<TracksFilter>>>('Tracks filter part.');
export const DiTracksFilterPartFavoritesProvider: Provider = {
  provide: DiTracksFilterPartFavorites,
  deps: [DiShowFavorites],
  useFactory: (favorites$: Observable<boolean>) =>
    favorites$.pipe(
      map<boolean, TracksFilter>((favorites) => ({favorites})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
