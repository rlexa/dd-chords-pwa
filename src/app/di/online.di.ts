import {InjectionToken} from '@angular/core';
import {Observable, of} from 'rxjs';

export const DiOnline = new InjectionToken<Observable<boolean>>('Online flag.', {
  providedIn: 'root',
  factory: () => of(!!navigator?.onLine),
});
