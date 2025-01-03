import {inject, InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {TracksFilter} from './di-tracks-filter';

export const DiTracksFilterQuery = new InjectionToken<BehaviorSubject<string>>('Track filter query.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});

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
