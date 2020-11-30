import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'dd-chords-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicComponent {}
