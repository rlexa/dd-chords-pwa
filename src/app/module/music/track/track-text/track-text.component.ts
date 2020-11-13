import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {RxCleanup, StateSubject} from 'dd-rxjs';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {normalizeTranspose, textToLines} from 'src/music';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-track-text',
  templateUrl: './track-text.component.html',
  styleUrls: ['./track-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackTextComponent implements OnDestroy {
  @RxCleanup() private readonly data$ = new StateSubject<string | null>(null);
  @RxCleanup() public readonly transpose$ = new StateSubject(0);
  @RxCleanup() public readonly showChords$ = new StateSubject(true);

  readonly trackByIndex = trackByIndex;

  @Input() set text(val: string | undefined) {
    this.data$.next(val || null);
  }

  @Input() set transpose(val: number) {
    this.transpose$.next(normalizeTranspose(val ?? 0));
  }

  @Input() set showChords(val: boolean) {
    this.showChords$.next(!!val);
  }

  public readonly lines$ = combineLatest([this.data$, this.transpose$, this.showChords$]).pipe(
    map(([data, transpose, showChords]) => textToLines(data ?? '', transpose).filter((line) => !line.hasChords || showChords)),
  );

  addTranspose = (add: number) => {
    this.transpose = this.transpose$.value + add;
  };

  toggleShowChords = () => {
    this.showChords = !this.showChords$.value;
  };

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }
}
