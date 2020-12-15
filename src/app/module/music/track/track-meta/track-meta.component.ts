import {ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DiCanShare} from 'src/app/module/common/di-common/di-common';
import {Track} from 'src/music';
import {trackToData} from 'src/music/music';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-track-meta',
  templateUrl: './track-meta.component.html',
  styleUrls: ['./track-meta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMetaComponent {
  constructor(@Inject(DiCanShare) public readonly canShare$: BehaviorSubject<boolean>) {}

  @Input() track: Track | undefined | null;

  trackByIndex = trackByIndex;

  async share(): Promise<void> {
    if (typeof navigator.share === 'function') {
      if (this.track) {
        try {
          await navigator.share({text: trackToData(this.track), title: this.track.title, url: window.location.href});
          console.error(`Share succeeded.`);
        } catch (ex) {
          console.error(`Share failed.`, ex);
        }
      }
    } else {
      console.log(`System does not allow sharing.`);
      this.canShare$.next(false);
    }
  }
}
