import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {identity} from 'src/util';
import {DiItemToTitle} from '../../common/di-common/di-item-to-x';
import {DiCurrentPerformers} from '../../di-music/di-current-performers';

@Component({
  selector: 'dd-chords-performers',
  templateUrl: './performers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: DiItemToTitle, useValue: identity}],
})
export class PerformersComponent {
  constructor(@Inject(DiCurrentPerformers) public readonly performers$: Observable<string[]>) {}
}
