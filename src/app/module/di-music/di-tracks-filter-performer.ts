import {inject, InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {TracksFilter} from './di-tracks-filter';

export const DiTracksFilterPerformer = new InjectionToken<StateSubject<string>>('Track filter performer.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});

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
