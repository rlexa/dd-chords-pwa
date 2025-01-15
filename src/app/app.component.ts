import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ServiceWorkerWatchDirective} from './shared/service-worker-watch';
import {TrackImportWatchDirective} from './shared/track-import-watch/track-import-watch.directive';

@Component({
  selector: 'dd-chords-app',
  template: `<router-outlet ddChordsServiceWorkerWatch ddChordsTrackWatchImport />`,
  styles: [
    `
      :host {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        min-width: 300px;
        overflow-x: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, ServiceWorkerWatchDirective, TrackImportWatchDirective],
})
export class AppComponent {}
