import {inject, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {DiTracksFilterPerformer} from './active';
import {TracksFilter} from './tracks-filter.di';

export const DiTracksFilterPartPerformer = new InjectionToken<Observable<Partial<TracksFilter>>>('Track filter part.', {
  providedIn: 'root',
  factory: () => {
    const performer$ = inject(DiTracksFilterPerformer);

    return performer$.pipe(
      map((performerHash): TracksFilter => ({performerHash})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
