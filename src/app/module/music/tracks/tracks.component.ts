import {ChangeDetectionStrategy, Component, EventEmitter, Inject, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DiCurrentTrackMetas, TrackMeta} from '../../di-music/di-current-tracks';
import {DiTracksFilterQuery} from '../../di-music/di-tracks-filter-query';

@Component({
  selector: 'dd-chords-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TracksComponent {
  constructor(
    @Inject(DiCurrentTrackMetas) public readonly tracks$: Observable<TrackMeta[]>,
    @Inject(DiTracksFilterQuery) public readonly tracksFilterQuery$: BehaviorSubject<string | null>,
  ) {}

  @Output() clickedItem = new EventEmitter<string>();
}
