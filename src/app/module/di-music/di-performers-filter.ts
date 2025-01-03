import {inject, InjectionToken} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {clearEmptyValues, jsonEqual, mergeObjects} from 'src/util';

export interface PerformersFilter {
  favorites?: boolean;
  query?: string;
}

export const DiPerformersFilterPart = new InjectionToken<Observable<Partial<PerformersFilter>>>('Performers filter part.');

export const DiPerformersFilter = new InjectionToken<Observable<PerformersFilter>>('Performers filter.', {
  providedIn: 'root',
  factory: () => {
    const filterPart = inject(DiPerformersFilterPart) as unknown as Observable<Partial<PerformersFilter>>[];

    return combineLatest(filterPart).pipe(map(mergeObjects), map(clearEmptyValues), distinctUntilChanged(jsonEqual));
  },
});
