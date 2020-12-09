import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'dd-chords-app',
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
