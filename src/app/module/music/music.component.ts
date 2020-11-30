import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup} from 'dd-rxjs';
import {BehaviorSubject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {DiTracksFilterPerformer} from '../di-music/di-tracks-filter-performer';

@Component({
  selector: 'dd-chords-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicComponent implements OnDestroy {
  constructor(
    @Inject(DiTracksFilterPerformer) public readonly tracksFilterPerformer$: BehaviorSubject<string | null>,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.tracksFilterPerformer$
      .pipe(
        filter((performer) => !!performer),
        takeUntil(this.done$),
      )
      .subscribe(() => {
        this.visibleArea = 'tracks';
        this.changeDetectorRef.markForCheck();
      });
  }

  @RxCleanup() private readonly done$ = new DoneSubject();

  visibleArea: 'track' | 'tracks' | 'performers' = 'performers';

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }

  resetPerformer(): void {
    if (this.visibleArea !== 'performers') {
      this.visibleArea = 'performers';
      this.tracksFilterPerformer$.next(null);
    }
  }
}
