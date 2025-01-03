import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {Track} from 'src/music';
import {DiShowChords} from '../../di-music/di-show-chords';
import {TrackMetaComponent} from './track-meta';
import {TrackTextComponent} from './track-text';

@Component({
  selector: 'dd-chords-track',
  template: `@if (track) {
      <article>
        <dd-chords-track-meta [track]="track" />
        <dd-chords-track-text [text]="track.data" [showChords]="showChords$ | async" (showChordsChange)="setShowChords($event)" />
      </article>
    } @else {
      <span>-</span>
    }`,
  styles: [
    `
      article {
        > :nth-child(1n + 1) {
          margin-top: var(--margin-default);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, TrackMetaComponent, TrackTextComponent],
})
export class TrackComponent {
  protected readonly showChords$ = inject(DiShowChords);

  @Input() track?: Track | null;

  protected readonly setShowChords = (val: boolean) => this.showChords$.next(!!val);
}
