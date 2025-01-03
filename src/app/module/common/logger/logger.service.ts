import {Injectable, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup, StateSubject} from 'dd-rxjs';
import {map, shareReplay, takeUntil} from 'rxjs/operators';
import {CacheService} from '../cache/cache.service';

type LogItemLevel = 'error' | 'info' | 'debug';

interface LogItem {
  level: LogItemLevel;
  message: string;
  timestamp: number;
}

@Injectable({providedIn: 'root'})
export class LoggerService implements OnDestroy, Pick<Console, 'error' | 'log' | 'debug'> {
  constructor(cacheService: CacheService) {
    cacheService.register('logs', this.logs$, (logs) =>
      logs?.filter((ii) => ii?.level && ii?.message && ii?.timestamp).forEach((logItem) => this.push(logItem)),
    );
  }

  private readonly logs: LogItem[] = new Array<LogItem>(10);

  @RxCleanup() private readonly done$ = new DoneSubject();
  @RxCleanup() private readonly logIndex$ = new StateSubject(0);

  readonly logs$ = this.logIndex$.pipe(
    map((logIndex) => {
      const logs: LogItem[] = [];
      for (let ii = 0; ii < this.logs.length; ++ii) {
        logs.push(this.logs[(ii + logIndex) % this.logs.length]);
      }
      return logs.filter((ii) => !!ii);
    }),
    shareReplay({refCount: true, bufferSize: 1}),
    takeUntil(this.done$),
  );

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }

  private push(logItem: LogItem): void {
    this.logs[this.logIndex$.value] = logItem;
    this.logIndex$.next((this.logIndex$.value + 1) % this.logs.length);
  }

  private add(level: LogItemLevel, message?: any, ...optionalParams: any[]): void {
    const text = [message, ...optionalParams]
      .map((ii) => ii.toString())
      .join(' ')
      .trim();

    if (level && text?.length) {
      this.push({level, message: text, timestamp: new Date().getTime()});
    }
  }

  debug(message?: any, ...optionalParams: any[]): void {
    this.add('debug', message, ...optionalParams);
    console.debug(message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    this.add('error', message, ...optionalParams);
    console.error(message, ...optionalParams);
  }

  log(message?: any, ...optionalParams: any[]): void {
    this.add('info', message, ...optionalParams);
    console.log(message, ...optionalParams);
  }
}
