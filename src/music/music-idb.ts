import {Observable} from 'rxjs';
import {PerformersFilter} from 'src/app/module/di-music/di-performers-filter';
import {queryStringValue} from 'src/app/module/di-music/util';
import {idbOpenRequest$} from 'src/indexeddb';
import {Track} from './music';

export interface IdbTrack extends Track {
  source: string;
  timestamp: number;
}

export const dbStoreTracks = 'tracks';

const keyHash: keyof IdbTrack = 'hash';
const keyPerformer: keyof IdbTrack = 'performer';
const keySource: keyof IdbTrack = 'source';
const keyTimestamp: keyof IdbTrack = 'timestamp';
const keyTitle: keyof IdbTrack = 'title';

function createStoreTracks(idb: IDBDatabase): void {
  const keyPath: keyof IdbTrack = 'id';
  const store = idb.createObjectStore(dbStoreTracks, {keyPath});

  store.createIndex(keyHash, keyHash, {unique: true});
  store.createIndex(keyPerformer, keyPerformer, {unique: false});
  store.createIndex(keyTitle, keyTitle, {unique: false});
  store.createIndex(keySource, keySource, {unique: false});
  store.createIndex(keyTimestamp, keyTimestamp, {unique: false});
}

function createDb(idb: IDBDatabase): void {
  createStoreTracks(idb);
}

export const idb$ = idbOpenRequest$('ddchords', 1, createDb);

export function upsertTrack$(db: IDBDatabase, source: string, track: Track): Observable<boolean> {
  return new Observable((sub) => {
    if (!track?.id || !track?.hash) {
      sub.error(new Error(`Upsert track error: invalid item ${JSON.stringify(track)}`));
      return;
    }
    const trans = db.transaction(dbStoreTracks, 'readwrite');

    trans.onabort = function onabort(): void {
      sub.error(new Error(`IDB transaction aborted.`));
    };
    trans.oncomplete = function oncomplete(): void {
      sub.complete();
    };
    trans.onerror = function onerror(): void {
      sub.error(new Error(`IDB transaction error: ${this.error}`));
    };

    const store = trans.objectStore(dbStoreTracks);

    const getRequest = store.get(track.id);
    getRequest.onerror = function onerror(ev): void {
      ev.stopPropagation();
      sub.error(new Error(`IDB transaction get error: ${this.error}`));
    };
    getRequest.onsuccess = function onsuccess(): void {
      const oldTrack = this.result;
      if (oldTrack?.hash === track.hash) {
        sub.next(false);
      } else {
        const idbTrack: IdbTrack = {...track, source, timestamp: new Date().getTime()};

        const putRequest = store.put(idbTrack);
        putRequest.onerror = function onerror(ev): void {
          ev.stopPropagation();
          sub.error(new Error(`IDB transaction add error: ${this.error}`));
        };
        putRequest.onsuccess = function onsuccessPut(): void {
          sub.next(true);
        };
      }
    };

    return () => {
      try {
        trans.abort();
      } catch {
        // ignore
      }
    };
  });
}

export function getPerformers$(db: IDBDatabase, query: PerformersFilter): Observable<string[]> {
  return new Observable((sub) => {
    const trans = db.transaction(dbStoreTracks, 'readonly');

    trans.onabort = function onabort(): void {
      sub.error(new Error(`IDB transaction aborted.`));
    };
    trans.oncomplete = function oncomplete(): void {
      sub.complete();
    };
    trans.onerror = function onerror(): void {
      sub.error(new Error(`IDB transaction error: ${this.error}`));
    };

    const index = trans.objectStore(dbStoreTracks).index(keyPerformer);
    const cursor = index.openKeyCursor(null, 'next');
    cursor.onerror = function onerror(ev): void {
      ev.stopPropagation();
      sub.error(new Error(`IDB transaction cursor error: ${this.error}`));
    };

    const collection = new Set<string>();
    cursor.onsuccess = function onsuccess(): void {
      if (this.result) {
        const performer = this.result.key.toString();
        if (queryStringValue(query.query, performer)) {
          collection.add(performer);
        }
        this.result.continue();
      } else {
        sub.next([...collection]);
      }
    };

    return () => {
      try {
        trans.abort();
      } catch {
        // ignore
      }
    };
  });
}
