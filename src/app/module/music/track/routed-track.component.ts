import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {combineLatest} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';
import {TrackService} from '../../di-music/track.service';
import {routeParamIdTrack} from '../music-route';

@Component({
  selector: 'dd-chords-routed-track',
  templateUrl: './routed-track.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutedTrackComponent {
  constructor(private readonly activatedRouteSnapshot: ActivatedRoute, private readonly trackService: TrackService) {}

  public readonly idTrack$ = this.activatedRouteSnapshot.paramMap.pipe(
    map((params) => params.get(routeParamIdTrack)),
    distinctUntilChanged(),
  );

  public readonly track$ = combineLatest([this.idTrack$, this.trackService.tracks$]).pipe(
    map(([id, tracks]) => tracks.find((ii) => ii.id === id) ?? undefined),
  );
}
