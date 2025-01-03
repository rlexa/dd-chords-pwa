/* eslint-disable @typescript-eslint/no-explicit-any */

import {DestroyRef, inject, Injectable, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, take, tap} from 'rxjs/operators';
import {jsonEqual} from 'src/util';

export interface Cached<T> {
  getter$: Observable<T>;
  init: (val: T | undefined) => void;
  key: string;
}

interface CachedMap {
  value: Record<string, any>;
  version: number;
}

const cachedMapKey = 'dd-chords-cache';
const cachedMapVersion = 2;

@Injectable({providedIn: 'root'})
export class CacheService implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.cached$
      .pipe(
        take(1),
        tap((cached) => {
          cached.forEach((ii) => this.initFromCache(ii.key, ii.init));
        }),
        switchMap(() => this.cachedMap$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((cachedMap) => this.set(cachedMapKey, cachedMap));
  }

  private readonly cache: Record<string, string> = typeof localStorage === 'undefined' ? {} : localStorage;

  private readonly cached$ = new BehaviorSubject<Cached<any>[]>([]);

  private readonly cachedMap$ = this.cached$.pipe(
    switchMap((cached) => combineLatest(cached.map((ii) => ii.getter$.pipe(map((val) => ({[ii.key]: val})))))),
    debounceTime(0),
    map((objs) => objs.reduce((acc, obj) => Object.assign(acc, obj), {})),
    map<object, CachedMap>((value) => ({value, version: cachedMapVersion})),
    distinctUntilChanged(jsonEqual),
  );

  private initFromCache<T>(key: string, init: (val: T | undefined) => void) {
    const cachedMap = this.get<CachedMap>(cachedMapKey);
    if (cachedMap?.version ?? 0 >= cachedMapVersion) {
      init(cachedMap?.value[key]);
    }
  }

  private set<T>(key: string, val: T) {
    this.cache[key] = JSON.stringify(val);
  }

  private get<T>(key: string): T | undefined {
    try {
      return JSON.parse(this.cache[key]) as T;
    } catch {
      /* ignore */
    }
    return undefined;
  }

  ngOnDestroy() {
    this.cached$.complete();
  }

  register<T>(key: string, getter$: Observable<T>, init: (val: T | undefined) => void) {
    this.initFromCache(key, init);
    this.cached$.next([...this.cached$.value, {getter$, init, key}]);
  }
}
