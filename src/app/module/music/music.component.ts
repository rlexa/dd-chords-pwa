import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Track} from 'src/music';
import {kinoPachkaSigaret} from 'src/music/testdata';

const track1: Track = {
  author: 'Виктор Цой',
  performer: 'Кино',
  title: 'Пачка сигарет',
  text: kinoPachkaSigaret,
};

@Component({
  selector: 'dd-chords-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MusicComponent {
  readonly track = track1;
}
