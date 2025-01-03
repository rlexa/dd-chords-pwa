import {HttpClient} from '@angular/common/http';
import {DestroyRef, inject, Injectable} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {combineLatest, of} from 'rxjs';
import {bufferCount, catchError, concatMap, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {dataToTrack} from 'src/music';
import {DiOnline} from '../common/di-common';
import {LoggerService} from '../common/logger';
import {DiCurrentTrackHashes} from './di-current-track-hashes';
import {TrackService} from './track.service';

interface Index {
  files: {hash?: string; path?: string}[];
}

const trackSourceBuiltIn = 'builtin';

@Injectable({providedIn: 'root'})
export class TrackImportService {
  private readonly currentHashes$ = inject(DiCurrentTrackHashes);
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpClient = inject(HttpClient);
  private readonly online$ = inject(DiOnline);
  private readonly trackService = inject(TrackService);
  private readonly loggerService = inject(LoggerService);

  constructor() {
    this.online$
      .pipe(
        filter((online) => online),
        switchMap(() => this.importLocalData$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (oks) => {
          if (oks.length) {
            this.loggerService.debug(`...local sync: ${oks.filter((ok) => ok).length}x success, ${oks.filter((ok) => !ok).length}x fail.`);
          }
        },
        error: (err) => this.loggerService.log(`Local sync error (maybe just offline).`, err),
        complete: () => this.loggerService.debug(`Local sync checked.`),
      });
  }

  private readonly haveHashes$ = this.currentHashes$.pipe(take(1));
  private readonly localIndex$ = this.httpClient.get<Index>('assets/dd-chords/dd-chords.json');

  private readonly importLocalData$ = combineLatest([this.localIndex$, this.haveHashes$]).pipe(
    map(([index, hashes]) => {
      if (!index?.files?.length) {
        throw new Error('Local sync aborted (no index or files found).');
      }
      return index.files.filter((file) => !file.hash || !hashes.has(file.hash)).map((file) => `assets/dd-chords/${file.path}`);
    }),
    tap((paths) => {
      if (paths.length) {
        this.loggerService.debug(`Local sync of ${paths.length} files...`);
      }
    }),
    switchMap((paths) =>
      of(...paths).pipe(
        concatMap((path) => this.loadLocalChordsFile$(path)),
        bufferCount(paths.length),
      ),
    ),
  );

  private readonly loadLocalChordsFile$ = (path: string) =>
    this.httpClient.get(path, {responseType: 'text'}).pipe(
      switchMap((text) => this.trackService.saveTrack$(trackSourceBuiltIn, dataToTrack(text))),
      catchError((err) => {
        this.loggerService.error(`Sync of local asset ${path} failed.`, err);
        return of(false);
      }),
    );
}
