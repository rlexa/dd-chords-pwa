import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Track} from 'src/music';

@Component({
  selector: 'dd-chords-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackComponent {
  @Input() track: Track | undefined;
}
