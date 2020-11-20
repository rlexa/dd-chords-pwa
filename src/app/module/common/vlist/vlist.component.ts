import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-vlist',
  templateUrl: './vlist.component.html',
  styleUrls: ['./vlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VlistComponent<T> {
  @Input() isRouting = false;
  @Input() items: T[] | undefined | null = undefined;
  @Output() selectedItemChange = new EventEmitter<T>();
  @Input() selectedItem: T | undefined = undefined;

  trackByIndex = trackByIndex;
}
