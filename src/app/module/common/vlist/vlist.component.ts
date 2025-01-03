import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, contentChild, Input, TemplateRef} from '@angular/core';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-vlist',
  template: `<ng-template #tmplItem let-item>
      <button class="btn btn-borderless text-ellipsis list-item item">{{ item }}</button>
    </ng-template>

    @if (items?.length) {
      <cdk-virtual-scroll-viewport [itemSize]="rowTemplate() ? (itemSize ?? itemSizeDefault) : itemSizeDefault">
        <ng-container *cdkVirtualFor="let ii of items; trackBy: trackByIndex">
          <ng-container *ngTemplateOutlet="rowTemplate() ?? tmplItem; context: {$implicit: ii}" />
        </ng-container>
      </cdk-virtual-scroll-viewport>
    } @else {
      <span>-</span>
    }`,
  styles: [
    `
      .cdk-virtual-scroll-viewport {
        height: 100%;

        .item {
          text-align: start;
          line-height: 1.5em;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ScrollingModule],
})
export class VlistComponent<T> {
  protected readonly itemSizeDefault = 23;

  @Input() itemSize?: number | null;
  @Input() items: T[] | undefined | null;

  protected readonly rowTemplate = contentChild(TemplateRef);

  protected readonly trackByIndex = trackByIndex;
}
