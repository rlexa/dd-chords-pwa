import {InjectionToken, Provider} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';
import {Performer, TracksFilter} from './di-tracks-filter';

export const DiTracksFilterPerformer = new InjectionToken<StateSubject<Performer | null>>('Track filter performer.', {
  providedIn: 'root',
  factory: () => new StateSubject<Performer | null>(null),
});

export const DiTracksFilterPartPerformer = new InjectionToken<Observable<Partial<TracksFilter>>>('Track filter part.');
export const DiTracksFilterPartPerformerProvider: Provider = {
  provide: DiTracksFilterPartPerformer,
  deps: [DiTracksFilterPerformer],
  useFactory: (performer$: Observable<Performer>) =>
    performer$.pipe(
      map<Performer, TracksFilter>((performer) => ({performer})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
