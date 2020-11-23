import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {DiCurrentPerformers} from '../../di-music/di-current-performers';
import {DiTracksFilterPerformer} from '../../di-music/di-tracks-filter-performer';

@Component({
  selector: 'dd-chords-performers',
  templateUrl: './performers.component.html',
  styleUrls: ['./performers.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformersComponent {
  constructor(
    @Inject(DiCurrentPerformers) public readonly performers$: Observable<string[]>,
    @Inject(DiTracksFilterPerformer) public readonly tracksFilterPerformer$: BehaviorSubject<string | null>,
  ) {}
}
