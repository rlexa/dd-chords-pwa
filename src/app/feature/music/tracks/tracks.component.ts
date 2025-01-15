import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DiCurrentTrackMetas, DiTracksFilterQuery} from 'src/app/di';
import {VlistComponent} from 'src/app/shared/vlist';

@Component({
  selector: 'dd-chords-tracks',
  template: `<input
      #inputQuery
      class="input"
      [value]="tracksFilterQuery$ | async"
      (input)="tracksFilterQuery$.next(inputQuery.value || '')"
    />
    <div class="content">
      <dd-chords-vlist [items]="tracks$ | async">
        <ng-template let-item>
          <button
            class="btn btn-borderless text-ellipsis list-item item"
            [routerLink]="item?.id"
            routerLinkActive="active"
            (click)="clickedItem.next(item?.id)"
          >
            {{ item?.title || '???' }}
          </button>
        </ng-template>
      </dd-chords-vlist>
    </div>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;

        .content {
          flex: 1 1 auto;
          position: relative;
        }
      }

      .item {
        text-align: start;
        line-height: 1.5em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, VlistComponent],
})
export class TracksComponent {
  protected readonly tracks$ = inject(DiCurrentTrackMetas);
  protected readonly tracksFilterQuery$ = inject(DiTracksFilterQuery);

  @Output() readonly clickedItem = new EventEmitter<string>();
}
