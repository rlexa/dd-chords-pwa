import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TrackImportService} from '../di-music/track-import.service';

@Component({
  selector: 'dd-chords-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicComponent {
  constructor(private readonly trackImportService: TrackImportService) {}
}
