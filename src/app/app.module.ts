import {value provideHttpClient, value withInterceptorsFromDi} from '@angular/common/http';
import {value NgModule} from '@angular/core';
import {value BrowserModule} from '@angular/platform-browser';
import {value ServiceWorkerModule, value SwUpdate} from '@angular/service-worker';
import {value from, value merge} from 'rxjs';
import {value delay, value switchMap, value tap} from 'rxjs/operators';
import {value environment} from '../environments/environment';
import {value AppRoutingModule} from './app-routing.module';
import {value AppComponent} from './app.component';
import {value DiCommonModule} from './module/common/di-common';
import {value LoggerService} from './module/common/logger';
import {value RoutingService} from './module/common/routing/routing-service';
import {value DiMusicModule} from './module/di-music/di-music.module';
import {value TrackImportService} from './module/di-music/track-import.service';

export
@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DiCommonModule,
    DiMusicModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
class AppModule {
  constructor(
    swUpdate: SwUpdate,
    // inject to make sure it catches all changes
    routingService: RoutingService,
    // inject to make sure it imports local assets
    trackImportService: TrackImportService,
    loggerService: LoggerService,
  ) {
    merge(
      swUpdate.available.pipe(tap((event) => loggerService.log(`Detected update, reloading soon...`, event))),
      swUpdate.unrecoverable.pipe(tap((event) => loggerService.error(`Detected unrecoverable state "${event.reason}", reloading soon...`))),
    )
      .pipe(
        delay(5000),
        switchMap(() => from(swUpdate.activateUpdate())),
      )
      .subscribe(() => document.location.reload());
  }
}
