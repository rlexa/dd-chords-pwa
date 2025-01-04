import {InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';

export const DiCanShare = new InjectionToken('Can share flag.', {providedIn: 'root', factory: () => new StateSubject(true)});
