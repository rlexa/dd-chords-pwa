import {ChangeDetectionStrategy, Component, TrackByFunction} from '@angular/core';
import {Track} from 'src/music';
import {TrackService} from '../../di-music/track.service';

@Component({
  selector: 'dd-chords-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracksComponent {
  constructor(private readonly trackService: TrackService) {}

  readonly tracks$ = this.trackService.tracks$;

  trackById: TrackByFunction<Track> = (index, item) => item?.id || `id#index`;
}
