import {ChangeDetectionStrategy, Component} from '@angular/core';
import {LoggerService} from '../common/logger';

@Component({
  selector: 'dd-chords-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {
  constructor(private readonly logger: LoggerService) {}

  readonly logs$ = this.logger.logs$;
}
