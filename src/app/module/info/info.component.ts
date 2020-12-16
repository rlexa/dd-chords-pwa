import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Observable} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {LoggerService} from '../common/logger';
import {DiCurrentTrackCount} from '../di-music/di-current-track-count';

@Component({
  selector: 'dd-chords-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  constructor(
    @Inject(DiCurrentTrackCount) public readonly currentTrackCount$: Observable<number>,
    private readonly logger: LoggerService,
  ) {}

  readonly logs$ = this.logger.logs$.pipe(debounceTime(0));
}
