import {Injectable, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup, StateSubject} from 'dd-rxjs';
import {debounceTime, map, shareReplay, takeUntil} from 'rxjs/operators';

type LogItemLevel = 'error' | 'info' | 'debug';

interface LogItem {
  level: LogItemLevel;
  message: string;
  timestamp: number;
}

@Injectable({providedIn: 'root'})
export class LoggerService implements OnDestroy, Pick<Console, 'error' | 'log' | 'debug'> {
  private readonly logs: LogItem[] = new Array<LogItem>(10);

  @RxCleanup() private readonly done$ = new DoneSubject();
  @RxCleanup() private readonly logIndex$ = new StateSubject(0);

  readonly logs$ = this.logIndex$.pipe(
    debounceTime(0),
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

  private push(level: LogItemLevel, message?: any, ...optionalParams: any[]): void {
    const text = [message, ...optionalParams]
      .map((ii) => ii.toString())
      .join(' ')
      .trim();

    if (level && text?.length) {
      this.logs[this.logIndex$.value] = {level, message: text, timestamp: new Date().getTime()};
      this.logIndex$.next((this.logIndex$.value + 1) % this.logs.length);
    }
  }

  debug(message?: any, ...optionalParams: any[]): void {
    this.push('debug', message, ...optionalParams);
    // tslint:disable-next-line: no-console
    console.debug(message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    this.push('error', message, ...optionalParams);
    console.error(message, ...optionalParams);
  }

  log(message?: any, ...optionalParams: any[]): void {
    this.push('info', message, ...optionalParams);
    console.log(message, ...optionalParams);
  }
}
