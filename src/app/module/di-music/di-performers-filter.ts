import {InjectionToken, Provider} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {clearEmptyValues, jsonEqual, mergeObjects} from 'src/util';

export interface PerformersFilter {
  query?: string;
}

export const DiPerformersFilterPart = new InjectionToken<Observable<Partial<PerformersFilter>>>('Performers filter part.');

export const DiPerformersFilter = new InjectionToken<Observable<PerformersFilter>>('Performers filter.');
export const DiPerformersFilterProvider: Provider = {
  provide: DiPerformersFilter,
  deps: [DiPerformersFilterPart],
  useFactory: (filterPart: Observable<Partial<PerformersFilter>>[]) =>
    combineLatest(filterPart).pipe(map(mergeObjects), map(clearEmptyValues), distinctUntilChanged(jsonEqual)),
};
