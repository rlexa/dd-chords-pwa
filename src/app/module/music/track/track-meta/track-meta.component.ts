import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {concatMap, Subject} from 'rxjs';
import {DiCanShare} from 'src/app/di';
import {TrackService} from 'src/app/module/di-music/track.service';
import {QueryParamTrackId, RouteShared} from 'src/app/routing';
import {ContainsPipe} from 'src/app/shared/contains-pipe';
import {LoggerService} from 'src/app/shared/logger';
import {Track} from 'src/music';
import {queryPlaylistFavorites} from 'src/music/music-idb';

@Component({
  selector: 'dd-chords-track-meta',
  template: `<h3>
      @for (meta of [track?.performer]; track $index) {
        @if (meta) {
          <span>{{ ($index > 0 ? ',' : '') + ' ' + meta }}</span>
        }
      }
    </h3>
    @if (track?.title; as title) {
      <h1>
        <span>{{ title }}</span>
        @if (canShare$ | async) {
          @if (track?.performer && track?.data) {
            <span>
              <button
                (click)="toggleFavorite(track?.id)"
                class="btn btn-dense btn-borderless"
                [class.active]="track?.playlists | contains: playlistFavorites"
              >
                <i class="fas fa-heart"></i>
              </button>
              <button (click)="share()" class="btn btn-dense btn-borderless"><i class="fas fa-share-alt"></i></button>
            </span>
          }
        }
      </h1>
    }`,
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
export class TrackMetaComponent implements OnDestroy, OnInit {
  protected readonly canShare$ = inject(DiCanShare);
  private readonly loggerService = inject(LoggerService);
  private readonly trackService = inject(TrackService);

  private readonly triggerToggleFavorite$ = new Subject<string>();

  @Input() track?: Track | null;

  protected readonly playlistFavorites = queryPlaylistFavorites;

  ngOnDestroy() {
    this.triggerToggleFavorite$.complete();
  }

  ngOnInit() {
    this.triggerToggleFavorite$.pipe(concatMap((id) => this.trackService.toggleTrackFavorite$(id))).subscribe();
  }

  protected async share(): Promise<void> {
    if (typeof navigator.share === 'function') {
      if (this.track) {
        const path = new URL(`${window.location.origin}/${RouteShared}`);
        path.searchParams.append(QueryParamTrackId, this.track.id ?? '');
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

  protected toggleFavorite(id?: string) {
    if (id) {
      this.triggerToggleFavorite$.next(id);
    }
  }
}
