import {Inject, Injectable, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup} from 'dd-rxjs';
import {Observable, Subject, forkJoin, of} from 'rxjs';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import {Track} from 'src/music';
import {getTrack$, toggleTrackFavorite$, upsertTrack$} from 'src/music/music-idb';
import {DiMusicIdb, DiMusicIdbChange, DiMusicIdbLive} from './di-music-idb';

@Injectable()
export class TrackService implements OnDestroy {
  constructor(
    @Inject(DiMusicIdb) private readonly db$: Observable<IDBDatabase>,
    @Inject(DiMusicIdbChange) private readonly dbChange$: Subject<number>,
    @Inject(DiMusicIdbLive) private readonly dbLive$: Observable<IDBDatabase>,
  ) {}

  @RxCleanup() private readonly done$ = new DoneSubject();

  readonly track$ = (id: string | null) => this.dbLive$.pipe(switchMap((db) => (!id ? of(null) : getTrack$(db, id))));

  destroy() {}
  ngOnDestroy() {
    this.destroy();
  }

  saveTrack$ = (source: string, track: Track) =>
    this.db$.pipe(
      switchMap((db) => upsertTrack$(db, source, track)),
      tap((saved) => {
        if (saved) {
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
          this.dbChange$.next(saved);
        }
      }),
      takeUntil(this.done$),
    );

  toggleTrackFavorite$ = (idTrack: string) =>
    this.db$.pipe(
      switchMap((db) => toggleTrackFavorite$(db, idTrack)),
      tap((saved) => {
        if (saved) {
          this.dbChange$.next(1);
        }
      }),
      takeUntil(this.done$),
    );
}
