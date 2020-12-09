import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DiCurrentPerformers} from '../../di-music/di-current-performers';
import {DiPerformersFilterQuery} from '../../di-music/di-performer-filter-query';
import {Performer} from '../../di-music/di-tracks-filter';
import {DiTracksFilterPerformer} from '../../di-music/di-tracks-filter-performer';

@Component({
  selector: 'dd-chords-performers',
  templateUrl: './performers.component.html',
  styleUrls: ['./performers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformersComponent {
  constructor(
    @Inject(DiCurrentPerformers) public readonly performers$: Observable<Performer[]>,
    @Inject(DiPerformersFilterQuery) public readonly performersFilterQuery$: BehaviorSubject<string | null>,
    @Inject(DiTracksFilterPerformer) public readonly tracksFilterPerformer$: BehaviorSubject<Performer | null>,
  ) {}
}
