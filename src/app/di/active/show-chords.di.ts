import {InjectionToken} from '@angular/core';
import {StateSubject} from 'dd-rxjs';

export const DiShowChords = new InjectionToken('Show chords flag.', {providedIn: 'root', factory: () => new StateSubject(true)});
