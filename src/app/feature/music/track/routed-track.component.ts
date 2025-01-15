import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input, OnDestroy} from '@angular/core';
import {switchMap, tap} from 'rxjs/operators';
import {DiTracksFilterPerformer} from 'src/app/di';
import {RouteParamIdTrack} from 'src/app/routing';
import {TrackService} from 'src/app/shared/track';
import {StateSubject} from 'src/util';
import {TrackComponent} from './track.component';

@Component({
  selector: 'dd-chords-routed-track',
  template: `<dd-chords-track [track]="track$ | async" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TrackComponent],
})
export class RoutedTrackComponent implements OnDestroy {
  private readonly trackService = inject(TrackService);
  private readonly tracksFilterPerformer$ = inject(DiTracksFilterPerformer);

  private readonly idTrack$ = new StateSubject<string | null>(null);

  @Input({alias: RouteParamIdTrack}) set trackId(val: string | null | undefined) {
    this.idTrack$.next(val ?? null);
  }

  public readonly track$ = this.idTrack$.pipe(
    switchMap((id) => this.trackService.track$(id)),
    tap((track) => {
      if (track?.performerHash && this.tracksFilterPerformer$.value !== track.performerHash) {
        this.tracksFilterPerformer$.next(track.performerHash);
      }
    }),
  );

  ngOnDestroy() {
    this.idTrack$.complete();
  }
}
