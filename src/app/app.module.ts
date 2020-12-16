import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule, SwUpdate} from '@angular/service-worker';
import {from, merge} from 'rxjs';
import {delay, switchMap, tap} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DiCommonModule} from './module/common/di-common';
import {LoggerService} from './module/common/logger';
import {RoutingService} from './module/common/routing/routing-service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DiCommonModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(routingService: RoutingService, swUpdate: SwUpdate, loggerService: LoggerService) {
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
