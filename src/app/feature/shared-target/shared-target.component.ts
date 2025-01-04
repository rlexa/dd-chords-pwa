import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {map, take} from 'rxjs/operators';
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

  ngOnInit() {
    this.activatedRoute.queryParams
      .pipe(
        take(1),
        map((query) => query[QueryParamTrackId]),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((sharedId) => this.router.navigate(sharedId ? [RouteUi, RouteTracks, sharedId] : [RouteUi], {replaceUrl: true}));
  }
}
