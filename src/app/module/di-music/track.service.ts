import {Inject, Injectable, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup} from 'dd-rxjs';
import {forkJoin, Observable, of, Subject} from 'rxjs';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import {dataToTrack, Track} from 'src/music';
import {getTrack$, upsertTrack$} from 'src/music/music-idb';
import {djangoPapagan, greenCrowKotPrishelNazad, kinoKogdaTvojaDevushkaBolna, kinoPachkaSigaret} from 'src/music/testdata';
import {DiMusicIdb, DiMusicIdbChange, DiMusicIdbLive} from './di-music-idb';

const trackSourceBuiltIn = 'builtin';

@Injectable()
export class TrackService implements OnDestroy {
  constructor(
    @Inject(DiMusicIdb) private readonly db$: Observable<IDBDatabase>,
    @Inject(DiMusicIdbChange) private readonly dbChange$: Subject<number>,
    @Inject(DiMusicIdbLive) private readonly dbLive$: Observable<IDBDatabase>,
  ) {
    this.saveTracks$(
      trackSourceBuiltIn,
      [djangoPapagan, greenCrowKotPrishelNazad, kinoPachkaSigaret, kinoKogdaTvojaDevushkaBolna].map(dataToTrack),
    ).subscribe({
      error: (err) => {
        console.log(`Failed to save tracks.`, err);
      },
    });
  }

  @RxCleanup() private readonly done$ = new DoneSubject();

  readonly track$ = (id: string | null) => this.dbLive$.pipe(switchMap((db) => (!id ? of(null) : getTrack$(db, id))));

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }

  saveTrack$ = (source: string, track: Track) =>
    this.db$.pipe(
      switchMap((db) => upsertTrack$(db, source, track)),
      tap((saved) => {
        if (saved) {
          console.log(`Saved 1 track from "${source}".`);
          this.dbChange$.next(1);
        }
      }),
      takeUntil(this.done$),
    );

  saveTracks$ = (source: string, tracks: Track[]) =>
    this.db$.pipe(
      switchMap((db) => forkJoin(tracks.map((track) => upsertTrack$(db, source, track)))),
      tap((iis) => {
        const saved = iis.filter((ii) => ii).length;
        if (saved > 0) {
          console.log(`Saved ${saved} tracks from "${source}".`);
          this.dbChange$.next(saved);
        }
      }),
      takeUntil(this.done$),
    );
}
