import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ServiceWorkerDirective} from './shared/service-worker';

@Component({
  selector: 'dd-chords-app',
  template: `<router-outlet ddChordsServiceWorker />`,
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
  imports: [RouterModule, ServiceWorkerDirective],
})
export class AppComponent {}
