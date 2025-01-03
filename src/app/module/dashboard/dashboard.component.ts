import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DiShowFavorites} from '../di-music/di-show-favorites';

@Component({
  selector: 'dd-chords-dashboard',
  template: `<div class="navigation">
      <button class="btn btn-borderless" [class.active]="showFavorits$ | async" (click)="toggleShowFavorites()">
        <i class="fas fa-heart"></i>
      </button>
      <button class="btn" routerLink="tracks" routerLinkActive="active">
        <i class="fas fa-music"></i>
      </button>
      <button class="btn" routerLink="info" routerLinkActive="active">
        <i class="fas fa-info"></i>
      </button>
    </div>
    <div class="content">
      <router-outlet></router-outlet>
    </div>`,
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class DashboardComponent {
  protected readonly showFavorits$ = inject(DiShowFavorites);

  protected readonly toggleShowFavorites = () => this.showFavorits$.next(!this.showFavorits$.value);
}
