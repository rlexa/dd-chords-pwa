import {InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {BehaviorSubject} from 'rxjs';

export const DiTracksFilterQuery = new InjectionToken<BehaviorSubject<string>>('Track filter query.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});
