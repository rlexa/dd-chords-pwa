import {Injectable, OnDestroy} from '@angular/core';
import {DoneSubject, RxCleanup} from 'dd-rxjs';
import {BehaviorSubject, Observable, combineLatest} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {jsonEqual} from 'src/util';

export interface Cached<T> {
  getter$: Observable<T>;
  init: (val: T | undefined) => void;
  key: string;
}

interface CachedMap {
  value: {[key: string]: any};
  version: number;
}

const cachedMapKey = 'dd-chords-cache';
const cachedMapVersion = 2;

@Injectable({providedIn: 'root'})
export class CacheService implements OnDestroy {
  constructor() {
    this.cached$
      .pipe(
        take(1),
        tap((cached) => {
          cached.forEach((ii) => this.initFromCache(ii.key, ii.init));
        }),
        switchMap(() => this.cachedMap$),
        takeUntil(this.done$),
      )
      .subscribe((cachedMap) => this.set(cachedMapKey, cachedMap));
  }

  private readonly cache: {[key: string]: string} = typeof localStorage === 'undefined' ? {} : localStorage;

  @RxCleanup() private readonly done$ = new DoneSubject();
  @RxCleanup() private readonly cached$ = new BehaviorSubject<Cached<any>[]>([]);

  private readonly cachedMap$ = this.cached$.pipe(
    switchMap((cached) => combineLatest(cached.map((ii) => ii.getter$.pipe(map((val) => ({[ii.key]: val})))))),
    debounceTime(0),
    map((objs) => objs.reduce((acc, obj) => Object.assign(acc, obj), {})),
    map<object, CachedMap>((value) => ({value, version: cachedMapVersion})),
    distinctUntilChanged(jsonEqual),
  );

  private initFromCache<T>(key: string, init: (val: T | undefined) => void): void {
    const cachedMap = this.get<CachedMap>(cachedMapKey);
    if (cachedMap?.version ?? 0 >= cachedMapVersion) {
      init(cachedMap?.value[key]);
    }
  }

  private set<T>(key: string, val: T): void {
    this.cache[key] = JSON.stringify(val);
  }

  private get<T>(key: string): T | undefined {
    try {
      return JSON.parse(this.cache[key]) as T;
    } catch {}
    return undefined;
  }

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }

  register<T>(key: string, getter$: Observable<T>, init: (val: T | undefined) => void): void {
    this.initFromCache(key, init);
    this.cached$.next([...this.cached$.value, {getter$, init, key}]);
  }
}
