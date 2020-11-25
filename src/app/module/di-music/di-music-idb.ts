import {InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {shareReplay} from 'rxjs/operators';
import {idb$} from 'src/music/music-idb';

export const DiMusicIdb = new InjectionToken<Observable<IDBDatabase>>('Music IndexedDB', {
  providedIn: 'root',
  factory: () => idb$.pipe(shareReplay(1)),
});
