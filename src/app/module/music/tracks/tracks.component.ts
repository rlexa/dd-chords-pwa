import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {Track} from 'src/music';
import {DiCurrentTracks} from '../../di-music/di-current-tracks';

@Component({
  selector: 'dd-chords-tracks',
  templateUrl: './tracks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracksComponent {
  constructor(@Inject(DiCurrentTracks) public readonly tracks$: Observable<Track[]>) {}
}
