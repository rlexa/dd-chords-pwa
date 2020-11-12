import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Meta, TRACK_META_TITLE} from 'src/music';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-track-meta',
  templateUrl: './track-meta.component.html',
  styleUrls: ['./track-meta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMetaComponent {
  @Input() meta: Meta[] | undefined;

  readonly TRACK_META_TITLE = TRACK_META_TITLE;
  readonly trackByIndex = trackByIndex;
}
