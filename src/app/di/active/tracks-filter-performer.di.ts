import {InjectionToken} from '@angular/core';
import {StateSubject} from 'src/util';

export const DiTracksFilterPerformer = new InjectionToken<StateSubject<string>>('Track filter performer.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});
