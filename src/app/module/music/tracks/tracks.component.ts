import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output} from '@angular/core';
import {RouterModule} from '@angular/router';
import {VlistComponent} from '../../common/vlist';
import {DiCurrentTrackMetas} from '../../di-music/di-current-tracks';
import {DiTracksFilterQuery} from '../../di-music/di-tracks-filter-query';

@Component({
  selector: 'dd-chords-tracks',
  template: `<input
      #inputQuery
      class="input"
      [value]="tracksFilterQuery$ | async"
      (input)="tracksFilterQuery$.next(inputQuery.value || undefined)"
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
  standalone: true,
  imports: [CommonModule, RouterModule, VlistComponent],
})
export class TracksComponent {
  protected readonly tracks$ = inject(DiCurrentTrackMetas);
  protected readonly tracksFilterQuery$ = inject(DiTracksFilterQuery);

  @Output() clickedItem = new EventEmitter<string>();
}
