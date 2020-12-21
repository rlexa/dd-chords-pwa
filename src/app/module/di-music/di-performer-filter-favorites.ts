import {InjectionToken, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {PerformersFilter} from './di-performers-filter';
import {DiShowFavorites} from './di-show-favorites';

export const DiPerformersFilterPartFavorites = new InjectionToken<Observable<Partial<PerformersFilter>>>('Performers filter part.');
export const DiPerformersFilterPartFavoritesProvider: Provider = {
  provide: DiPerformersFilterPartFavorites,
  deps: [DiShowFavorites],
  useFactory: (favorites$: Observable<boolean>) =>
    favorites$.pipe(
      map<boolean, PerformersFilter>((favorites) => ({favorites})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
