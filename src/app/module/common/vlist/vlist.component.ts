import {ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-vlist',
  templateUrl: './vlist.component.html',
  styleUrls: ['./vlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VlistComponent<T> {
  @Input() itemSize = 23;
  @Input() items: T[] | undefined | null = undefined;

  @ContentChild(TemplateRef) rowTemplate: TemplateRef<T> | undefined = undefined;

  trackByIndex = trackByIndex;
}
