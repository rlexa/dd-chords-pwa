import {InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';

export const DiShowFavorites = new InjectionToken('Show favorites flag.', {providedIn: 'root', factory: () => new StateSubject(false)});
