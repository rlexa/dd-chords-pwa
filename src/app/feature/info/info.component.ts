import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {debounceTime} from 'rxjs/operators';
import {DiCurrentTrackCount} from 'src/app/di';
import {LoggerService} from 'src/app/shared/logger';

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
    @for (log of logs$ | async; track $index) {
      <p class="log level-{{ log.level }}">{{ log.timestamp | date: 'HH:mm:ss.SSS' }} {{ log.message }}</p>
    }
    <hr />
  </div>`,
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class InfoComponent {
  protected readonly currentTrackCount$ = inject(DiCurrentTrackCount);
  private readonly logger = inject(LoggerService);

  protected readonly logs$ = this.logger.logs$.pipe(debounceTime(0));
}
