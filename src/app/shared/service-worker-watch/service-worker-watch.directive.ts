import {DestroyRef, Directive, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SwUpdate} from '@angular/service-worker';
import {delay, from, merge, switchMap, tap} from 'rxjs';
import {LoggerService} from 'src/app/module/common/logger';

@Directive({selector: '[ddChordsServiceWorkerWatch]', standalone: true})
export class ServiceWorkerWatchDirective implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly loggerService = inject(LoggerService);
  private readonly swUpdate = inject(SwUpdate);

  ngOnInit() {
    merge(
      this.swUpdate.versionUpdates.pipe(tap((event) => this.loggerService.log(`Detected update, reloading soon...`, event))),
      this.swUpdate.unrecoverable.pipe(
        tap((event) => this.loggerService.error(`Detected unrecoverable state "${event.reason}", reloading soon...`)),
      ),
    )
      .pipe(
        delay(5000),
        switchMap(() => from(this.swUpdate.activateUpdate())),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => document.location.reload());
  }
}
