import {DestroyRef, inject, Injectable, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {StateSubject} from 'dd-rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {CacheService} from 'src/app/shared/cache';

type LogItemLevel = 'error' | 'info' | 'debug';

interface LogItem {
  level: LogItemLevel;
  message: string;
  timestamp: number;
}

@Injectable({providedIn: 'root'})
export class LoggerService implements OnDestroy, Pick<Console, 'error' | 'log' | 'debug'> {
  private readonly cacheService = inject(CacheService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.cacheService.register('logs', this.logs$, (logs) =>
      logs?.filter((ii) => ii?.level && ii?.message && ii?.timestamp).forEach((logItem) => this.push(logItem)),
    );
  }

  private readonly logs: LogItem[] = new Array<LogItem>(10);

  private readonly logIndex$ = new StateSubject(0);

  readonly logs$ = this.logIndex$.pipe(
    map((logIndex) => {
      const logs: LogItem[] = [];
      for (let ii = 0; ii < this.logs.length; ++ii) {
        logs.push(this.logs[(ii + logIndex) % this.logs.length]);
      }
      return logs.filter((ii) => !!ii);
    }),
    shareReplay({refCount: true, bufferSize: 1}),
    takeUntilDestroyed(this.destroyRef),
  );

  ngOnDestroy() {
    this.logIndex$.complete();
  }

  private push(logItem: LogItem) {
    this.logs[this.logIndex$.value] = logItem;
    this.logIndex$.next((this.logIndex$.value + 1) % this.logs.length);
  }

  private add(level: LogItemLevel, message?: unknown, ...optionalParams: unknown[]) {
    const text = [message, ...optionalParams]
      .map((ii) => ii?.toString())
      .join(' ')
      .trim();

    if (level && text?.length) {
      this.push({level, message: text, timestamp: new Date().getTime()});
    }
  }

  debug(message?: unknown, ...optionalParams: unknown[]) {
    this.add('debug', message, ...optionalParams);
    console.debug(message, ...optionalParams);
  }

  error(message?: unknown, ...optionalParams: unknown[]) {
    this.add('error', message, ...optionalParams);
    console.error(message, ...optionalParams);
  }

  log(message?: unknown, ...optionalParams: unknown[]) {
    this.add('info', message, ...optionalParams);
    console.log(message, ...optionalParams);
  }
}
