import {inject, InjectionToken} from '@angular/core';
import {ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {distinctUntilChanged, filter, map, shareReplay, startWith} from 'rxjs/operators';
import {jsonEqual} from 'src/util';

const mergeParams = (route: ActivatedRouteSnapshot, into: Record<string, string | null> = {}) => {
  route.paramMap.keys.forEach((key) => (into[key] = route.paramMap.get(key)));
  if (route.children.length) {
    route.children.forEach((child) => mergeParams(child, into));
  }
  return into;
};

/** Current `Router` params. */
export const DiCurrentRouterParams = new InjectionToken<Observable<Record<string, string | null>>>('Global Router params.', {
  providedIn: 'root',
  factory: () => {
    const router = inject(Router);

    return router.events.pipe(
      // events is a cold stream, let's start with a fake navigation event with current state's url
      startWith(new NavigationEnd(0, router.routerState.snapshot.url, router.routerState.snapshot.url)),
      // only need end of navigation events for the current final resolved route
      filter((ev) => ev instanceof NavigationEnd),
      map(() => mergeParams(router.routerState.snapshot.root)),
      distinctUntilChanged(jsonEqual),
      shareReplay(1),
    );
  },
});
