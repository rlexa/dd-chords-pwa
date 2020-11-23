import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {DiCurrentTrackMetas, TrackMeta} from '../../di-music/di-current-tracks';

@Component({
  selector: 'dd-chords-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracksComponent {
  constructor(@Inject(DiCurrentTrackMetas) public readonly tracks$: Observable<TrackMeta[]>) {}
}
