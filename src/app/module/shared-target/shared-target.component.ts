import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

@Component({
  selector: 'dd-chords-shared-target',
  templateUrl: './shared-target.component.html',
  styleUrls: ['./shared-target.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedTargetComponent {
  constructor(private readonly activatedRoute: ActivatedRoute) {}

  readonly queryParams$ = this.activatedRoute.queryParams;
}
