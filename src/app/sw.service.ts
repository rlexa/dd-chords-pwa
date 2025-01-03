import {inject, Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {delay, from, merge, switchMap, tap} from 'rxjs';
import {LoggerService} from './module/common/logger';

@Injectable({providedIn: 'root'})
export class SwService {
  private readonly loggerService = inject(LoggerService);
  private readonly swUpdate = inject(SwUpdate);

  constructor() {
    merge(
      this.swUpdate.versionUpdates.pipe(tap((event) => this.loggerService.log(`Detected update, reloading soon...`, event))),
      this.swUpdate.unrecoverable.pipe(
        tap((event) => this.loggerService.error(`Detected unrecoverable state "${event.reason}", reloading soon...`)),
      ),
    )
      .pipe(
        delay(5000),
        switchMap(() => from(this.swUpdate.activateUpdate())),
      )
      .subscribe(() => document.location.reload());
  }
}
