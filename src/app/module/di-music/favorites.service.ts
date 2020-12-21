import {Injectable, OnDestroy} from '@angular/core';
import {RxCleanup} from 'dd-rxjs';
import {Subject} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {CacheService} from '../common/cache/cache.service';

@Injectable({providedIn: 'root'})
export class FavoritesService implements OnDestroy {
  constructor(cacheService: CacheService) {
    cacheService.register('favorites', this.favoriteHashes$, (favoriteHashes) => {
      if (this.favoriteHashes.size) {
        this.favoriteHashes.clear();
        this.triggerChange$.next();
      }
      favoriteHashes?.forEach((ii) => this.add(ii));
    });
  }

  private readonly favoriteHashes = new Set<string>();

  @RxCleanup() private readonly triggerChange$ = new Subject();

  public readonly favoriteHashes$ = this.triggerChange$.pipe(
    debounceTime(0),
    map(() => [...this.favoriteHashes]),
  );

  destroy(): void {}
  ngOnDestroy(): void {
    this.destroy();
  }

  add(hash: string): void {
    if (hash && !this.favoriteHashes.has(hash)) {
      this.favoriteHashes.add(hash);
      this.triggerChange$.next();
    }
  }

  remove(hash: string): void {
    if (hash && this.favoriteHashes.has(hash)) {
      this.favoriteHashes.delete(hash);
      this.triggerChange$.next();
    }
  }

  toggle(hash: string): void {
    if (this.favoriteHashes.has(hash)) {
      this.remove(hash);
    } else {
      this.add(hash);
    }
  }
}
