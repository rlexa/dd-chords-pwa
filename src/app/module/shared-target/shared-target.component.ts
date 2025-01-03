import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params, Router, RouterModule} from '@angular/router';
import {from} from 'rxjs';
import {exhaustMap, take} from 'rxjs/operators';
import {QueryParamTrackId, RouteTracks, RouteUi} from 'src/app/routing';

@Component({
  selector: 'dd-chords-shared-target',
  template: `<button class="btn btn-dense" routerLink="..">
    <i class="fas fa-home"></i>
  </button>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        padding: var(--padding-default);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class SharedTargetComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  private readonly queryParams$ = this.activatedRoute.queryParams;

  private navigate$ = (query: Params) =>
    from(this.router.navigate(query[QueryParamTrackId] ? [RouteUi, RouteTracks, query[QueryParamTrackId]] : [RouteUi], {replaceUrl: true}));

  ngOnInit() {
    this.queryParams$
      .pipe(
        take(1),
        exhaustMap((query) => this.navigate$(query)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
