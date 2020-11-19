import {ChangeDetectionStrategy, Component} from '@angular/core';
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
}
