import {InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';

export const DiShowChords = new InjectionToken('Flag.', {providedIn: 'root', factory: () => new StateSubject(true)});
