import {Inject, Injectable, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup} from 'dd-rxjs';
import {combineLatest, forkJoin, Observable, of, Subject} from 'rxjs';
import {map, startWith, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {dataToTrack, Track} from 'src/music';
import {getPerformers$, upsertTrack$} from 'src/music/music-idb';
import {djangoPapagan, greenCrowKotPrishelNazad, kinoKogdaTvojaDevushkaBolna, kinoPachkaSigaret} from 'src/music/testdata';
import {DiMusicIdb} from './di-music-idb';
import {PerformersFilter} from './di-performers-filter';

const trackSourceBuiltIn = 'builtin';

@Injectable({providedIn: 'root'})
export class TrackService implements OnDestroy {
  constructor(@Inject(DiMusicIdb) private readonly db$: Observable<IDBDatabase>) {
    this.saveTracks$(
      trackSourceBuiltIn,
      [djangoPapagan, greenCrowKotPrishelNazad, kinoKogdaTvojaDevushkaBolna, kinoPachkaSigaret].map(dataToTrack),
    ).subscribe({
      error: (err) => {
        console.log(`Failed to save tracks.`, err);
      },
    });
  }

  @RxCleanup() private readonly done$ = new DoneSubject();
  @RxCleanup() private readonly change$ = new Subject();

  private readonly changedDb$ = combineLatest([this.db$, this.change$.pipe(startWith(0))]).pipe(
    map(([db]) => db),
    takeUntil(this.done$),
  );

  private readonly dataTracks$ = of([djangoPapagan, greenCrowKotPrishelNazad, kinoKogdaTvojaDevushkaBolna, kinoPachkaSigaret]);
  readonly tracks$ = this.dataTracks$.pipe(map((iis) => iis.map(dataToTrack)));

  readonly performers$ = (query: PerformersFilter) => this.changedDb$.pipe(switchMap((db) => getPerformers$(db, query)));

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }

  saveTrack$ = (source: string, track: Track) =>
    this.db$.pipe(
      switchMap((db) => upsertTrack$(db, source, track)),
      take(1),
      tap((saved) => {
        if (saved) {
          console.log(`Saved 1 track from "${source}".`);
          this.change$.next(1);
        }
      }),
      takeUntil(this.done$),
    );

  saveTracks$ = (source: string, tracks: Track[]) =>
    this.db$.pipe(
      switchMap((db) => forkJoin(tracks.map((track) => upsertTrack$(db, source, track)))),
      take(1),
      tap((iis) => {
        const saved = iis.filter((ii) => ii).length;
        if (saved > 0) {
          console.log(`Saved ${saved} tracks from "${source}".`);
          this.change$.next(saved);
        }
      }),
      takeUntil(this.done$),
    );
}
