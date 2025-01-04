import {InjectionToken} from '@angular/core';
import {StateSubject} from 'src/util';

export const DiShowChords = new InjectionToken('Show chords flag.', {providedIn: 'root', factory: () => new StateSubject(true)});
