import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {normalizeTranspose, textToLines} from 'src/music';
import {StateSubject} from 'src/util';

@Component({
  selector: 'dd-chords-track-text',
  template: `<div class="actions">
      <button (click)="toggleShowChords()" class="btn btn-dense"><i class="fas fa-guitar"></i></button>
      @if (showChords$ | async) {
        <button (click)="addTranspose(1)" class="btn btn-dense"><i class="fas fa-arrow-up"></i></button>
        <button (click)="addTranspose(-1)" class="btn btn-dense"><i class="fas fa-arrow-down"></i></button>
        <span>{{ transpose$ | async }}</span>
      }
    </div>
    @if (lines$ | async; as lines) {
      @for (line of lines; track $index) {
        @if (!line.text) {
          <br />
        } @else {
          <p [class.indent]="!!line.indent" [class.chords]="!!line.hasChords">{{ line.text }}</p>
        }
      }
    }`,
  styleUrls: ['./track-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class TrackTextComponent implements OnDestroy {
  private readonly data$ = new StateSubject<string | null>(null);

  protected readonly showChords$ = new StateSubject(true);
  protected readonly transpose$ = new StateSubject(0);

  @Input() set text(val: string | null | undefined) {
    this.data$.next(val || null);
    this.transpose = 0;
  }

  @Input() set transpose(val: number | null | undefined) {
    this.transpose$.next(normalizeTranspose(val ?? 0));
  }

  @Output() showChordsChange = new EventEmitter<boolean>();
  @Input() set showChords(val: boolean | null | undefined) {
    this.showChords$.next(!!val);
  }

  protected readonly lines$ = combineLatest([this.data$, this.transpose$, this.showChords$]).pipe(
    map(([data, transpose, showChords]) => textToLines(data ?? '', transpose, showChords)),
  );

  ngOnDestroy() {
    this.data$.complete();
    this.showChords$.complete();
    this.transpose$.complete();
  }

  protected readonly addTranspose = (add: number) => (this.transpose = this.transpose$.value + add);
  protected readonly toggleShowChords = () => this.showChordsChange.emit(!this.showChords$.value);
}
