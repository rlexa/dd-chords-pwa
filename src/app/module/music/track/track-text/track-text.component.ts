import {ChangeDetectionStrategy, Component, Inject, Input, OnDestroy} from '@angular/core';
import {RxCleanup, StateSubject} from 'dd-rxjs';
import {combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {DiShowChords} from 'src/app/module/di-music/di-show-chords';
import {normalizeTranspose, textToLines} from 'src/music';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-track-text',
  templateUrl: './track-text.component.html',
  styleUrls: ['./track-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackTextComponent implements OnDestroy {
  constructor(@Inject(DiShowChords) public readonly showChords$: StateSubject<boolean>) {}

  @RxCleanup() private readonly data$ = new StateSubject<string | null>(null);
  @RxCleanup() public readonly transpose$ = new StateSubject(0);

  readonly trackByIndex = trackByIndex;

  @Input() set text(val: string | undefined) {
    this.data$.next(val || null);
  }

  @Input() set transpose(val: number) {
    this.transpose$.next(normalizeTranspose(val ?? 0));
  }

  public readonly lines$ = combineLatest([this.data$, this.transpose$, this.showChords$]).pipe(
    map(([data, transpose, showChords]) => textToLines(data ?? '', transpose).filter((line) => !line.hasChords || showChords)),
  );

  addTranspose = (add: number) => {
    this.transpose = this.transpose$.value + add;
  };

  toggleShowChords = () => this.showChords$.next(!this.showChords$.value);

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }
}
