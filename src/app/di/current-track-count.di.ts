import {inject, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';
import {distinctUntilChanged, map, shareReplay} from 'rxjs/operators';
import {DiCurrentTrackHashes} from './current-track-hashes.di';

export const DiCurrentTrackCount = new InjectionToken<Observable<number>>('Current track count', {
  providedIn: 'root',
  factory: () => {
    const trackHashes$ = inject(DiCurrentTrackHashes);

    return trackHashes$.pipe(
      map((trackHashes) => trackHashes.size),
      distinctUntilChanged(),
      shareReplay({refCount: true, bufferSize: 1}),
    );
  },
});
