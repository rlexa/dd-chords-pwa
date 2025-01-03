import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {ContainsPipe} from 'src/app/module/common/di-common';
import {DiCanShare} from 'src/app/module/common/di-common/di-common';
import {LoggerService} from 'src/app/module/common/logger';
import {TrackService} from 'src/app/module/di-music/track.service';
import {queryParamTrackId} from 'src/app/module/shared-target/shared-target';
import {RouteShared} from 'src/app/routing';
import {Track} from 'src/music';
import {queryPlaylistFavorites} from 'src/music/music-idb';
import {trackByIndex} from 'src/util';

@Component({
  selector: 'dd-chords-track-meta',
  template: `<h3>
      <ng-container *ngFor="let meta of [track?.performer]; trackBy: trackByIndex; let index = index">
        <span *ngIf="meta">{{ (index > 0 ? ',' : '') + ' ' + meta }}</span>
      </ng-container>
    </h3>
    <h1 *ngIf="track?.title as title">
      <span>{{ title }}</span>
      <ng-container *ngIf="canShare$ | async">
        <span *ngIf="track?.performer && track?.data">
          <button
            (click)="toggleFavorite(track?.id)"
            class="btn btn-dense btn-borderless"
            [class.active]="track?.playlists | contains: playlistFavorites"
          >
            <i class="fas fa-heart"></i>
          </button>
          <button (click)="share()" class="btn btn-dense btn-borderless"><i class="fas fa-share-alt"></i></button>
        </span>
      </ng-container>
    </h1>`,
  styles: [
    `
      :host {
        > :nth-child(1n + 2) {
          margin-top: var(--margin-default);
        }

        h1 {
          font-size: 1.5em;

          button {
            margin-left: var(--margin-wide);
            font-size: 1rem;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ContainsPipe],
})
export class TrackMetaComponent {
  protected readonly canShare$ = inject(DiCanShare);
  private readonly loggerService = inject(LoggerService);
  private readonly trackService = inject(TrackService);

  @Input() track?: Track | null;

  protected readonly playlistFavorites = queryPlaylistFavorites;

  protected readonly trackByIndex = trackByIndex;

  protected async share(): Promise<void> {
    if (typeof navigator.share === 'function') {
      if (this.track) {
        const path = new URL(`${window.location.origin}/${RouteShared}`);
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

  protected async toggleFavorite(id?: string) {
    if (id) {
      await firstValueFrom(this.trackService.toggleTrackFavorite$(id));
    }
  }
}
