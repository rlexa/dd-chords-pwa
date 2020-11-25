import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {distinctUntilChanged, map, switchMap} from 'rxjs/operators';
import {TrackService} from '../../di-music/track.service';
import {routeParamIdTrack} from '../music-route';

@Component({
  selector: 'dd-chords-routed-track',
  templateUrl: './routed-track.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutedTrackComponent {
  constructor(private readonly activatedRouteSnapshot: ActivatedRoute, private readonly trackService: TrackService) {}

  private readonly idTrack$ = this.activatedRouteSnapshot.paramMap.pipe(
    map((params) => params.get(routeParamIdTrack)),
    distinctUntilChanged(),
  );

  public readonly track$ = this.idTrack$.pipe(switchMap((id) => this.trackService.track$(id)));
}
