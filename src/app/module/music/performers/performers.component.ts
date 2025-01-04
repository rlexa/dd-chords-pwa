import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {DiCurrentPerformers, DiPerformersFilterQuery, DiTracksFilterPerformer} from 'src/app/di';
import {VlistComponent} from 'src/app/shared/vlist';

@Component({
  selector: 'dd-chords-performers',
  template: `<input
      #inputQuery
      class="input"
      [value]="performersFilterQuery$ | async"
      (input)="performersFilterQuery$.next(inputQuery.value || '')"
    />
    <div class="content">
      <dd-chords-vlist [items]="performers$ | async">
        <ng-template let-item>
          <button
            class="btn btn-borderless text-ellipsis list-item item"
            [class.active]="(tracksFilterPerformer$ | async) === item?.performerHash"
            (click)="tracksFilterPerformer$.next(item.performerHash || '')"
          >
            {{ item.performer }}
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
  imports: [CommonModule, VlistComponent],
})
export class PerformersComponent {
  protected readonly performers$ = inject(DiCurrentPerformers);
  protected readonly performersFilterQuery$ = inject(DiPerformersFilterQuery);
  protected readonly tracksFilterPerformer$ = inject(DiTracksFilterPerformer);
}
