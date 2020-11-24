import {InjectionToken, Provider} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {clearEmptyValues, jsonEqual, mergeObjects} from 'src/util';

export interface TracksFilter {
  performer?: string;
  query?: string;
}

export const DiTracksFilterPart = new InjectionToken<Observable<Partial<TracksFilter>>>('Track filter part.');

export const DiTracksFilter = new InjectionToken<Observable<TracksFilter>>('Track filter.');
export const DiTracksFilterProvider: Provider = {
  provide: DiTracksFilter,
  deps: [DiTracksFilterPart],
  useFactory: (diTracksFilterPart: Observable<Partial<TracksFilter>>[]) =>
    combineLatest(diTracksFilterPart).pipe(map(mergeObjects), map(clearEmptyValues), distinctUntilChanged(jsonEqual)),
};
