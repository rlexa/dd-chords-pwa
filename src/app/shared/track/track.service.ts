import {DestroyRef, inject, Injectable} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {forkJoin, of} from 'rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {DiMusicIdb, DiMusicIdbChange, DiMusicIdbLive} from 'src/app/di';
import {Track} from 'src/music';
import {getTrack$, toggleTrackFavorite$, upsertTrack$} from 'src/music/music-idb';

@Injectable({providedIn: 'root'})
export class TrackService {
  private readonly db$ = inject(DiMusicIdb);
  private readonly dbChange$ = inject(DiMusicIdbChange);
  private readonly dbLive$ = inject(DiMusicIdbLive);
  private readonly destroyRef = inject(DestroyRef);

  readonly track$ = (id: string | null) => this.dbLive$.pipe(switchMap((db) => (!id ? of(null) : getTrack$(db, id))));

  readonly saveTrack$ = (source: string, track: Track) =>
    this.db$.pipe(
      switchMap((db) => upsertTrack$(db, source, track)),
      tap((saved) => {
        if (saved) {
          this.dbChange$.next();
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    );

  readonly saveTracks$ = (source: string, tracks: Track[]) =>
    this.db$.pipe(
      switchMap((db) => forkJoin(tracks.map((track) => upsertTrack$(db, source, track)))),
      tap((iis) => {
        const saved = iis.filter((ii) => ii).length;
        if (saved > 0) {
          this.dbChange$.next();
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    );

  readonly toggleTrackFavorite$ = (idTrack: string) =>
    this.db$.pipe(
      switchMap((db) => toggleTrackFavorite$(db, idTrack)),
      tap((saved) => {
        if (saved) {
          this.dbChange$.next();
        }
      }),
      takeUntilDestroyed(this.destroyRef),
    );
}
