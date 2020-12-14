import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ServiceWorkerModule, SwUpdate} from '@angular/service-worker';
import {from} from 'rxjs';
import {delay, switchMap, tap} from 'rxjs/operators';
import {environment} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DiCommonModule} from './module/common/di-common';
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
  constructor(routingService: RoutingService, swUpdate: SwUpdate) {
    swUpdate.available
      .pipe(
        tap((event) => console.log(`Detected update.`, event)),
        delay(5000),
        switchMap(() => from(swUpdate.activateUpdate())),
      )
      .subscribe(() => document.location.reload());
  }
}
