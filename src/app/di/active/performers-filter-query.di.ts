import {InjectionToken} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {StateSubject} from 'src/util';

export const DiPerformersFilterQuery = new InjectionToken<BehaviorSubject<string>>('Performers filter query.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});
