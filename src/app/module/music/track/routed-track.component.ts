import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {DiTracksFilterPerformer} from '../../di-music/di-tracks-filter-performer';
import {TrackService} from '../../di-music/track.service';
import {routeParamIdTrack} from '../music-route';

@Component({
  selector: 'dd-chords-routed-track',
  templateUrl: './routed-track.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutedTrackComponent {
  constructor(
    private readonly activatedRouteSnapshot: ActivatedRoute,
    private readonly trackService: TrackService,
    @Inject(DiTracksFilterPerformer) private readonly tracksFilterPerformer$: BehaviorSubject<string | null>,
  ) {}

  private readonly idTrack$ = this.activatedRouteSnapshot.paramMap.pipe(
    map((params) => params.get(routeParamIdTrack)),
    distinctUntilChanged(),
  );

  public readonly track$ = this.idTrack$.pipe(
    switchMap((id) => this.trackService.track$(id)),
    tap((track) => {
      if (track?.performer && !this.tracksFilterPerformer$.value) {
        this.tracksFilterPerformer$.next(track.performer);
      }
    }),
  );
}
