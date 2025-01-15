import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterModule} from '@angular/router';
import {debounceTime, filter, map, take} from 'rxjs/operators';
import {DiCurrentPerformer, DiTracksFilterPerformer} from 'src/app/di';
import {RouteParamIdTrack} from 'src/app/routing';
import {RoutingService} from 'src/app/shared/routing';
import {PerformersComponent} from './performers';
import {TracksComponent} from './tracks';

type VisibleList = 'performers' | 'tracks';

@Component({
  selector: 'dd-chords-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, PerformersComponent, TracksComponent],
})
export class MusicComponent implements OnInit {
  protected readonly currentPerformer$ = inject(DiCurrentPerformer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly tracksFilterPerformer$ = inject(DiTracksFilterPerformer);
  private readonly routingService = inject(RoutingService);

  protected readonly visibleList = signal<VisibleList>('performers');
  protected readonly visibleTrack = signal(false);

  ngOnInit() {
    this.routingService.params$
      .pipe(
        debounceTime(0),
        take(1),
        map((params) => params[RouteParamIdTrack]),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((id) => this.visibleTrack.set(!!id));

    this.currentPerformer$
      .pipe(
        filter((performer) => !!performer),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.showList('tracks'));
  }

  protected resetPerformer() {
    this.showList('performers');
    this.tracksFilterPerformer$.next('');
  }

  protected showTrack(id: string) {
    if (id) {
      this.visibleTrack.set(true);
    }
  }

  protected backFromTrack() {
    this.showList(this.tracksFilterPerformer$.value ? 'tracks' : 'performers');
    this.visibleTrack.set(false);
  }

  protected showList(val: VisibleList) {
    if (val && this.visibleList() !== val) {
      this.visibleList.set(val);
    }
  }
}
