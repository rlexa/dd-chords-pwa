import {DestroyRef, inject, Injectable, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';

const mergeParams = (route: ActivatedRouteSnapshot, into: Record<string, string | null> = {}) => {
  route.paramMap.keys.forEach((key) => (into[key] = route.paramMap.get(key)));
  if (route.children.length) {
    route.children.forEach((child) => mergeParams(child, into));
  }
  return into;
};

/**
 * Exposes current Router state url in a simple way.
 *
 * Create-By-Injecting as soon as possible to make sure to catch all initial route changes (if needed).
 */
@Injectable({providedIn: 'root'})
export class RoutingService implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(
        // events is a cold stream, let's start with a fake navigation event with current state's url
        startWith(new NavigationEnd(0, this.router.routerState.snapshot.url, this.router.routerState.snapshot.url)),
        // only need end of navigation events for the current final resolved route
        filter((ev) => ev instanceof NavigationEnd),
        map((ev) => (ev as NavigationEnd).urlAfterRedirects),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((url) => {
        this.urlCurrent$.next(url);
        this.paramsCurrent$.next(mergeParams(this.router.routerState.snapshot.root));
      });
  }

  /** Needs to have state due to `Router.events` being a cold stream. */
  private readonly urlCurrent$ = new BehaviorSubject<string | null>(null);

  /** Needs to have state due to `Router.events` being a cold stream. */
  private readonly paramsCurrent$ = new BehaviorSubject<Record<string, string | null>>({});

  /** URL parameters, as detected by `Router` (as opposed to query parameters). */
  readonly params$ = this.paramsCurrent$.asObservable();

  /** Full URL, as detected by `Router`. */
  readonly url$ = this.urlCurrent$.asObservable();

  /** URL part only (no query nor hash), as detected by `Router`. */
  readonly route$ = this.url$.pipe(map((url) => (url || '').split('?')[0].split('#')[0]));

  /** URL parts only (no query nor hash), as detected by `Router`. */
  readonly routeParts$ = this.route$.pipe(map((url) => url.split('/').filter((ii) => ii.length)));

  ngOnDestroy() {
    this.paramsCurrent$.complete();
    this.urlCurrent$.complete();
  }
}
