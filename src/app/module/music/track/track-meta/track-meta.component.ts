import {ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {routeShared} from 'src/app/app-routing';
import {DiCanShare} from 'src/app/module/common/di-common/di-common';
import {LoggerService} from 'src/app/module/common/logger';
import {TrackService} from 'src/app/module/di-music/track.service';
import {queryParamTrackId} from 'src/app/module/shared-target/shared-target';
import {Track} from 'src/music';
import {queryPlaylistFavorites} from 'src/music/music-idb';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-track-meta',
  templateUrl: './track-meta.component.html',
  styleUrls: ['./track-meta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMetaComponent {
  constructor(
    private readonly trackService: TrackService,
    @Inject(DiCanShare) public readonly canShare$: BehaviorSubject<boolean>,
    private readonly loggerService: LoggerService,
  ) {}

  @Input() track: Track | undefined | null;

  public readonly playlistFavorites = queryPlaylistFavorites;

  trackByIndex = trackByIndex;

  async share(): Promise<void> {
    if (typeof navigator.share === 'function') {
      if (this.track) {
        const path = new URL(`${window.location.origin}/${routeShared}`);
        path.searchParams.append(queryParamTrackId, this.track.id ?? '');
        const url = path.toString();
        try {
          await navigator.share({title: this.track.title, url});
          this.loggerService.log(`Shared.`, url);
        } catch (ex) {
          this.loggerService.error(`Share failed.`, ex);
        }
      }
    } else {
      this.loggerService.error(`System does not allow sharing.`);
      this.canShare$.next(false);
    }
  }

  async toggleFavorite(id: string | undefined): Promise<void> {
    if (id) {
      await this.trackService.toggleTrackFavorite$(id).toPromise();
    }
  }
}
