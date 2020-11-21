import {InjectionToken, Provider} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {jsonEqual} from 'src/util';

export interface TracksFilter {
  performer?: string;
  title?: string;
}

export const DiTracksFilterPerformer = new InjectionToken<Observable<string | null>>('Track filter performer.', {
  providedIn: 'root',
  factory: () => new StateSubject<string | null>(null),
});

export const DiTracksFilterPartPerformer = new InjectionToken<Observable<Partial<TracksFilter>>>('Track filter part.');
export const DiTracksFilterPartPerformerProvider: Provider = {
  provide: DiTracksFilterPartPerformer,
  deps: [DiTracksFilterPerformer],
  useFactory: (performer$: Observable<string>) =>
    performer$.pipe(
      map<string, TracksFilter>((performer) => ({performer})),
      distinctUntilChanged(jsonEqual),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};