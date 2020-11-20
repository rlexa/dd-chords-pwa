import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {getId, getTitle} from 'src/music/music';
import {DiItemToRoute, DiItemToTitle} from '../../common/di-common/di-item-to-x';
import {DiCurrentTrackMetas, TrackMeta} from '../../di-music/di-current-tracks';

@Component({
  selector: 'dd-chords-tracks',
  templateUrl: './tracks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: DiItemToRoute, useValue: getId},
    {provide: DiItemToTitle, useValue: getTitle},
  ],
})
export class TracksComponent {
  constructor(@Inject(DiCurrentTrackMetas) public readonly tracks$: Observable<TrackMeta[]>) {}
}
