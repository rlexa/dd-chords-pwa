import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {APP_INITIALIZER, enableProdMode, inject, provideExperimentalZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {provideServiceWorker} from '@angular/service-worker';
import {AppComponent} from './app/app.component';
import {RoutingService} from './app/module/common/routing';
import {TrackImportService} from './app/module/di-music/track-import.service';
import {SwService} from './app/sw.service';
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
    // routing
    provideRouter([{path: '', loadChildren: () => import(`./app/start/routes`)}]),
    // app init
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const routingService = inject(RoutingService);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const swService = inject(SwService);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const trackImportService = inject(TrackImportService);
      },
    },
  ],
}).catch((err) => console.error(err));
