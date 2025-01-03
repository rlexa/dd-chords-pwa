import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {from} from 'rxjs';
import {exhaustMap, take} from 'rxjs/operators';
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
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {}

  private readonly queryParams$ = this.activatedRoute.queryParams;

  private navigate$ = (query: Params) =>
    from(this.router.navigate(query[queryParamTrackId] ? [routeUi, routeTracks, query[queryParamTrackId]] : [routeUi], {replaceUrl: true}));

  ngOnInit(): void {
    this.queryParams$
      .pipe(
        take(1),
        exhaustMap((query) => this.navigate$(query)),
      )
      .subscribe();
  }
}
