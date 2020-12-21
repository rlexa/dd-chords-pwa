import {InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';

export const DiShowFavorites = new InjectionToken('Flag.', {providedIn: 'root', factory: () => new StateSubject(false)});
