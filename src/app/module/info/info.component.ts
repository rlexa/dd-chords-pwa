import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'dd-chords-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent {}
