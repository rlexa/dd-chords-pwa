import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {routeUi} from 'src/app/app-routing';
import {routeTracks} from '../dashboard/routed-dashboard';
import {queryParamTrackId} from './shared-target';

@Component({
  selector: 'dd-chords-shared-target',
  templateUrl: './shared-target.component.html',
  styleUrls: ['./shared-target.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTargetComponent implements OnInit {
  constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {}

  private readonly queryParams$ = this.activatedRoute.queryParams;

  ngOnInit(): void {
    this.queryParams$.pipe(take(1)).subscribe((query) => this.navigate(query));
  }

  private navigate(query: Params): void {
    if (query[queryParamTrackId]) {
      this.router.navigate([routeUi, routeTracks, query[queryParamTrackId]], {replaceUrl: true});
    } else {
      this.router.navigate([routeUi], {replaceUrl: true});
    }
  }
}
