import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DiShowFavorites} from 'src/app/di';
import {RouteInfo, RouteTracks} from 'src/app/routing';

@Component({
  selector: 'dd-chords-dashboard',
  template: `<div class="navigation">
      @let showFavorites = showFavorites$ | async;

      <button class="btn btn-borderless" [class.active]="showFavorites" (click)="setShowFavorites(!showFavorites)">
        <i class="fas fa-heart"></i>
      </button>
      <button class="btn" [routerLink]="RouteTracks" routerLinkActive="active">
        <i class="fas fa-music"></i>
      </button>
      <button class="btn" [routerLink]="RouteInfo" routerLinkActive="active">
        <i class="fas fa-info"></i>
      </button>
    </div>
    <div class="content">
      <router-outlet />
    </div>`,
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
})
export class DashboardComponent {
  protected readonly showFavorites$ = inject(DiShowFavorites);

  protected readonly RouteInfo = RouteInfo;
  protected readonly RouteTracks = RouteTracks;

  protected readonly setShowFavorites = (val: boolean) => this.showFavorites$.next(val);
}
