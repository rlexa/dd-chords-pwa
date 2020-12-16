import {InjectionToken, Provider} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {DiCurrentTrackHashes} from './di-current-track-hashes';

export const DiCurrentTrackCount = new InjectionToken<Observable<number>>('Current track count');
export const DiCurrentTrackCountProvider: Provider = {
  provide: DiCurrentTrackCount,
  deps: [DiCurrentTrackHashes],
  useFactory: (trackHashes$: Observable<Set<string>>): Observable<number> =>
    trackHashes$.pipe(
      map((trackHashes) => trackHashes.size),
      distinctUntilChanged(),
      shareReplay({refCount: true, bufferSize: 1}),
    ),
};
