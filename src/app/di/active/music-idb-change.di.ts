import {InjectionToken} from '@angular/core';
import {Subject} from 'rxjs';

export const DiMusicIdbChange = new InjectionToken<Subject<void>>('Music IndexedDB change stream', {
  providedIn: 'root',
  factory: () => new Subject(),
});
