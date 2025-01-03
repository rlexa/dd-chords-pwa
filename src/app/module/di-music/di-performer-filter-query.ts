import {inject, InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {PerformersFilter} from './di-performers-filter';

export const DiPerformersFilterQuery = new InjectionToken<BehaviorSubject<string>>('Performers filter performer.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});

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
