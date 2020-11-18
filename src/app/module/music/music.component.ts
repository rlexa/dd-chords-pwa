import {ChangeDetectionStrategy, Component} from '@angular/core';
import {dataToTrack} from 'src/music';
import {greenCrowKotPrishelNazad} from 'src/music/testdata';

@Component({
  selector: 'dd-chords-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicComponent {
  readonly track = dataToTrack(greenCrowKotPrishelNazad);
}
