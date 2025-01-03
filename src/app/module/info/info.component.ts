import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {LoggerService} from '../common/logger';
import {DiCurrentTrackCount} from '../di-music/di-current-track-count';

@Component({
  selector: 'dd-chords-info',
  template: `<div class="content">
    <h3>DD-Chords</h3>
    <p>devdroy, Alex Rempel</p>
    <hr />

    <h3>Tracks</h3>
    <p>Count: {{ currentTrackCount$ | async }}</p>
    <hr />

    <h3>Logs</h3>
    <p *ngFor="let log of logs$ | async" class="log level-{{ log.level }}">{{ log.timestamp | date: 'HH:mm:ss.SSS' }} {{ log.message }}</p>
    <hr />
  </div>`,
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class InfoComponent {
  protected readonly currentTrackCount$ = inject(DiCurrentTrackCount);
  private readonly logger = inject(LoggerService);

  readonly logs$ = this.logger.logs$.pipe(debounceTime(0));
}
