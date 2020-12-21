import {ChangeDetectionStrategy, Component, Inject, Input} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {routeShared} from 'src/app/app-routing';
import {DiCanShare} from 'src/app/module/common/di-common/di-common';
import {LoggerService} from 'src/app/module/common/logger';
import {FavoritesService} from 'src/app/module/di-music/favorites.service';
import {queryParamTrackId} from 'src/app/module/shared-target/shared-target';
import {Track} from 'src/music';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-track-meta',
  templateUrl: './track-meta.component.html',
  styleUrls: ['./track-meta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMetaComponent {
  constructor(
    @Inject(DiCanShare) public readonly canShare$: BehaviorSubject<boolean>,
    private readonly favoritesService: FavoritesService,
    private readonly loggerService: LoggerService,
  ) {}

  @Input() track: Track | undefined | null;

  public readonly favorites$ = this.favoritesService.favoriteHashes$;

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

  toggleFavorite(hash: string | undefined): void {
    this.favoritesService.toggle(hash ?? '');
  }
}
