import {InjectionToken, Provider} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {PerformersFilter} from './di-performers-filter';

export const DiPerformersFilterQuery = new InjectionToken<Observable<string | null>>('Performers filter performer.', {
  providedIn: 'root',
  factory: () => new StateSubject<string | null>(null),
});

export const DiPerformersFilterPartQuery = new InjectionToken<Observable<Partial<PerformersFilter>>>('Performers filter part.');
export const DiPerformersFilterPartQueryProvider: Provider = {
  provide: DiPerformersFilterPartQuery,
  deps: [DiPerformersFilterQuery],
  useFactory: (query$: Observable<string>) =>
    query$.pipe(
      map<string, PerformersFilter>((query) => ({query})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
