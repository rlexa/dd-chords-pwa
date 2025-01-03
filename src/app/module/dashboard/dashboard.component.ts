import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {DiShowFavorites} from '../di-music/di-show-favorites';

@Component({
  selector: 'dd-chords-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  constructor(@Inject(DiShowFavorites) public readonly showFavorits$: BehaviorSubject<boolean>) {}

  toggleShowFavorites() {
    this.showFavorits$.next(!this.showFavorits$.value);
  }
}
