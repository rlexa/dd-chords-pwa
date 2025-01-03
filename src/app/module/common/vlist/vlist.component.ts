import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-vlist',
  template: `<ng-template #tmplEmpty>
      <span>-</span>
    </ng-template>

    <ng-template #tmplItem let-item>
      <button class="btn btn-borderless text-ellipsis list-item item">{{ item }}</button>
    </ng-template>

    <cdk-virtual-scroll-viewport
      *ngIf="items?.length; else tmplEmpty"
      [itemSize]="rowTemplate ? (itemSize ?? itemSizeDefault) : itemSizeDefault"
    >
      <ng-container *cdkVirtualFor="let ii of items; trackBy: trackByIndex">
        <ng-container *ngTemplateOutlet="rowTemplate ?? tmplItem; context: {$implicit: ii}"></ng-container>
      </ng-container>
    </cdk-virtual-scroll-viewport>`,
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

  @ContentChild(TemplateRef) rowTemplate: TemplateRef<T> | undefined;

  protected readonly trackByIndex = trackByIndex;
}
