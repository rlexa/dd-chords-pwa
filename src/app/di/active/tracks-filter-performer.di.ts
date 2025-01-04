import {InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';

export const DiTracksFilterPerformer = new InjectionToken<StateSubject<string>>('Track filter performer.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});
