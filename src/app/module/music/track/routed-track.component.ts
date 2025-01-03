import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {RouteParamIdTrack} from 'src/app/routing';
import {DiTracksFilterPerformer} from '../../di-music/di-tracks-filter-performer';
import {TrackService} from '../../di-music/track.service';
import {TrackComponent} from './track.component';

@Component({
  selector: 'dd-chords-routed-track',
  template: `<dd-chords-track [track]="track$ | async"></dd-chords-track>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TrackComponent],
})
export class RoutedTrackComponent {
  private readonly activatedRouteSnapshot = inject(ActivatedRoute);
  private readonly trackService = inject(TrackService);
  private readonly tracksFilterPerformer$ = inject(DiTracksFilterPerformer);

  private readonly idTrack$ = this.activatedRouteSnapshot.paramMap.pipe(
    map((params) => params.get(RouteParamIdTrack)),
    distinctUntilChanged(),
  );

  public readonly track$ = this.idTrack$.pipe(
    switchMap((id) => this.trackService.track$(id)),
    tap((track) => {
      if (track?.performerHash && this.tracksFilterPerformer$.value !== track.performerHash) {
        this.tracksFilterPerformer$.next(track.performerHash);
      }
    }),
  );
}
