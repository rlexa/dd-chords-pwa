import {InjectionToken} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {StateSubject} from 'src/util';

export const DiTracksFilterQuery = new InjectionToken<BehaviorSubject<string>>('Track filter query.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});
