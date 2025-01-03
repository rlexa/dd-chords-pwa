import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input, OnDestroy} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {switchMap, tap} from 'rxjs/operators';
import {RouteParamIdTrack} from 'src/app/routing';
import {DiTracksFilterPerformer} from '../../di-music/di-tracks-filter-performer';
import {TrackService} from '../../di-music/track.service';
import {TrackComponent} from './track.component';

@Component({
  selector: 'dd-chords-routed-track',
  template: `<dd-chords-track [track]="track$ | async" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
