import {inject, InjectionToken} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {clearEmptyValues, jsonEqual, mergeObjects} from 'src/util';

export interface Performer {
  performer: string;
  performerHash: string;
}

export interface TracksFilter {
  favorites?: boolean;
  performerHash?: string;
  query?: string;
}

export const DiTracksFilterPart = new InjectionToken<Observable<Partial<TracksFilter>>>('Track filter part.');

export const DiTracksFilter = new InjectionToken<Observable<TracksFilter>>('Track filter.', {
  providedIn: 'root',
  factory: () => {
    const diTracksFilterPart = inject(DiTracksFilterPart) as unknown as Observable<Partial<TracksFilter>>[];

    return combineLatest(diTracksFilterPart).pipe(map(mergeObjects), map(clearEmptyValues), distinctUntilChanged(jsonEqual));
  },
});
