import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ServiceWorkerDirective} from './shared/service-worker';
import {TrackImportDirective} from './shared/track-import';

@Component({
  selector: 'dd-chords-app',
  template: `<router-outlet ddChordsServiceWorker ddChordsTrackImport />`,
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
  standalone: true,
  imports: [RouterModule, ServiceWorkerDirective, TrackImportDirective],
})
export class AppComponent {}
