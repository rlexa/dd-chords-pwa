import {InjectionToken} from '@angular/core';
import {StateSubject} from 'src/util';

export const DiShowFavorites = new InjectionToken('Show favorites flag.', {providedIn: 'root', factory: () => new StateSubject(false)});
