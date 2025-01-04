import {InjectionToken} from '@angular/core';
import {StateSubject} from 'src/util';

export const DiCanShare = new InjectionToken('Can share flag.', {providedIn: 'root', factory: () => new StateSubject(true)});
