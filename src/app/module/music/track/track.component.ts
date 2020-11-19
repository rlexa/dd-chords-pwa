import {ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import {StateSubject} from 'dd-rxjs';
import {Track} from 'src/music';
import {DiShowChords} from '../../di-music/di-show-chords';

@Component({
  selector: 'dd-chords-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackComponent {
  constructor(@Inject(DiShowChords) public readonly showChords$: StateSubject<boolean>) {}

  @Input() track: Track | undefined | null;

  setShowChords = (val: boolean) => this.showChords$.next(!!val);
}
