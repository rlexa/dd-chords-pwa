import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'dd-chords-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
