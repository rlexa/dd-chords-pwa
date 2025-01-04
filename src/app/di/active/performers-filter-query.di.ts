import {InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {BehaviorSubject} from 'rxjs';

export const DiPerformersFilterQuery = new InjectionToken<BehaviorSubject<string>>('Performers filter query.', {
  providedIn: 'root',
  factory: () => new StateSubject<string>(''),
});
