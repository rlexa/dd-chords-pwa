import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup} from 'dd-rxjs';
import {BehaviorSubject} from 'rxjs';
import {debounceTime, filter, map, take, takeUntil} from 'rxjs/operators';
import {RoutingService} from '../common/routing';
import {Performer} from '../di-music/di-tracks-filter';
import {DiTracksFilterPerformer} from '../di-music/di-tracks-filter-performer';
import {routeParamIdTrack} from './music-route';

type VisibleList = 'performers' | 'tracks';

@Component({
  selector: 'dd-chords-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicComponent implements OnDestroy {
  constructor(
    @Inject(DiTracksFilterPerformer) public readonly tracksFilterPerformer$: BehaviorSubject<Performer | null>,
    private readonly routingService: RoutingService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.routingService.params$
      .pipe(
        debounceTime(0),
        take(1),
        map((params) => params[routeParamIdTrack]),
      )
      .subscribe((id) => (this.visibleTrack = !!id));

    this.tracksFilterPerformer$
      .pipe(
        filter((performer) => !!performer),
        takeUntil(this.done$),
      )
      .subscribe(() => {
        this.showList('tracks');
      });
  }

  @RxCleanup() private readonly done$ = new DoneSubject();

  visibleList: VisibleList = 'performers';
  visibleTrack = false;

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }

  resetPerformer(): void {
    this.showList('performers');
    this.tracksFilterPerformer$.next(null);
  }

  showTrack(id: string): void {
    if (id) {
      this.visibleTrack = true;
    }
  }

  backFromTrack(): void {
    this.showList(this.tracksFilterPerformer$.value ? 'tracks' : 'performers');
    this.visibleTrack = false;
  }

  showList(val: VisibleList): void {
    if (val && this.visibleList !== val) {
      this.visibleList = val;
      this.changeDetectorRef.markForCheck();
    }
  }
}
