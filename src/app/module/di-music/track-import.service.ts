import {HttpClient} from '@angular/common/http';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup} from 'dd-rxjs';
import {combineLatest, Observable, of} from 'rxjs';
import {bufferCount, catchError, concatMap, map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {dataToTrack} from 'src/music';
import {DiCurrentTrackHashes} from './di-current-track-hashes';
import {TrackService} from './track.service';

interface Index {
  files: {hash?: string; path?: string}[];
}

const trackSourceBuiltIn = 'builtin';

@Injectable()
export class TrackImportService implements OnDestroy {
  constructor(
    @Inject(DiCurrentTrackHashes) private readonly currentHashes$: Observable<Set<string>>,
    private readonly httpClient: HttpClient,
    private readonly trackService: TrackService,
  ) {
    combineLatest([this.localIndex$, this.haveHashes$])
      .pipe(
        map(([index, hashes]) => {
          if (!index?.files?.length) {
            throw new Error('Local sync aborted (no index or files found).');
          }
          return index.files.filter((file) => !file.hash || !hashes.has(file.hash)).map((file) => `assets/dd-chords/${file.path}`);
        }),
        tap((paths) => {
          if (paths.length) {
            console.log(`Local sync of ${paths.length} files...`);
          }
        }),
        switchMap((paths) =>
          of(...paths).pipe(
            concatMap((path) => this.loadLocalChordsFile$(path)),
            bufferCount(paths.length),
          ),
        ),
        takeUntil(this.done$),
      )
      .subscribe({
        next: (oks) => {
          if (oks.length) {
            console.log(`...local sync: ${oks.filter((ok) => ok).length}x success, ${oks.filter((ok) => !ok).length}x fail.`);
          }
        },
        error: (err) => console.log(`Local sync error.`, err),
        complete: () => console.log(`Local sync checked.`),
      });
  }

  @RxCleanup() private readonly done$ = new DoneSubject();

  private readonly haveHashes$ = this.currentHashes$.pipe(take(1));
  private readonly localIndex$ = this.httpClient.get<Index>('assets/dd-chords/dd-chords.json');

  private loadLocalChordsFile$ = (path: string) =>
    this.httpClient.get(path, {responseType: 'text'}).pipe(
      switchMap((text) => this.trackService.saveTrack$(trackSourceBuiltIn, dataToTrack(text))),
      catchError((err) => {
        console.log(`Sync of local asset ${path} failed.`, err);
        return of(false);
      }),
    );

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }
}
