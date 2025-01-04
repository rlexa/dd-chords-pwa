import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {APP_INITIALIZER, enableProdMode, inject, provideExperimentalZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {provideServiceWorker} from '@angular/service-worker';
import {of} from 'rxjs';
import {AppComponent} from './app/app.component';
import {
  DiPerformersFilterPart,
  DiPerformersFilterPartFavorites,
  DiPerformersFilterPartQuery,
  DiShowChords,
  DiShowFavorites,
  DiTracksFilterPart,
  DiTracksFilterPartFavorites,
  DiTracksFilterPartPerformer,
  DiTracksFilterPartQuery,
  PerformersFilter,
  TracksFilter,
} from './app/di';
import {RouteShared, RouteUi} from './app/routing';
import {CacheService} from './app/shared/cache';
import {RoutingService} from './app/shared/routing';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    // ng
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideExperimentalZonelessChangeDetection(),
    provideServiceWorker('ngsw-worker.js', {enabled: environment.production}),
    // 3rd
    // local
    {provide: DiPerformersFilterPart, multi: true, useValue: of<PerformersFilter>({})},
    {provide: DiPerformersFilterPart, multi: true, useExisting: DiPerformersFilterPartFavorites},
    {provide: DiPerformersFilterPart, multi: true, useExisting: DiPerformersFilterPartQuery},
    {provide: DiTracksFilterPart, multi: true, useValue: of<TracksFilter>({})},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartFavorites},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartPerformer},
    {provide: DiTracksFilterPart, multi: true, useExisting: DiTracksFilterPartQuery},
    // routing
    provideRouter(
      [
        {path: RouteShared, loadChildren: () => import('./app/feature/shared-target/routes')},
        {path: RouteUi, loadChildren: () => import('./app/feature/dashboard/routes')},
        {path: '', redirectTo: RouteUi, pathMatch: 'full'},
        {path: '**', redirectTo: ''},
      ],
      withComponentInputBinding(),
    ),
    // app init
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const cacheService = inject(CacheService);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const routingService = inject(RoutingService);
        const showChords$ = inject(DiShowChords);
        const showFavorites$ = inject(DiShowFavorites);

        return () => {
          cacheService.register('showChords', showChords$, (val) => showChords$.next(val ?? showChords$.value));
          cacheService.register('showFavorites', showFavorites$, (val) => showFavorites$.next(val ?? showFavorites$.value));
        };
      },
    },
  ],
}).catch((err) => console.error(err));
