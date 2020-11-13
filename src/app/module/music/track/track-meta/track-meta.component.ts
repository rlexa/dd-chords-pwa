import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Track} from 'src/music';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-track-meta',
  templateUrl: './track-meta.component.html',
  styleUrls: ['./track-meta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMetaComponent {
  @Input() track: Track | undefined;

  trackByIndex = trackByIndex;
}
