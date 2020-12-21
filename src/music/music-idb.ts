import {Observable, of} from 'rxjs';
import {TrackMeta} from 'src/app/module/di-music/di-current-tracks';
import {PerformersFilter} from 'src/app/module/di-music/di-performers-filter';
import {Performer, TracksFilter} from 'src/app/module/di-music/di-tracks-filter';
import {filterStringValue, queryStringValue} from 'src/app/module/di-music/util';
import {idbOpenRequest$} from 'src/indexeddb';
import {Track} from './music';

export interface IdbTrack extends Track {
  source: string;
  timestamp: number;
}

const dbVersion = 5;

export const dbStoreTracks = 'tracks';

const separatorPlaylists = '<|>';
const playlistFavorites = '#favorites';

export const playlistToQuery = (playlist: string | undefined) => `${separatorPlaylists}${playlist ?? '???'}${separatorPlaylists}`;
export const queryPlaylistFavorites = playlistToQuery(playlistFavorites);

const keyHash: keyof IdbTrack = 'hash';
const keyPerformer: keyof IdbTrack = 'performer';
const keyPerformerHash: keyof IdbTrack = 'performerHash';
const keySource: keyof IdbTrack = 'source';
const keyTimestamp: keyof IdbTrack = 'timestamp';
const keyTitle: keyof IdbTrack = 'title';

function createStoreIfMissing(
  name: string,
  db: IDBDatabase,
  transaction: IDBTransaction | null,
  options?: IDBObjectStoreParameters,
): IDBObjectStore {
  return db.objectStoreNames.contains(name) && transaction ? transaction.objectStore(name) : db.createObjectStore(name, options);
}

function createIndexIfMissing(store: IDBObjectStore, name: string, options?: IDBIndexParameters): void {
  if (!store.indexNames.contains(name)) {
    store.createIndex(name, name, options);
  }
}

function upgradeStoreTracks(db: IDBDatabase, transaction: IDBTransaction | null, oldVersion: number): void {
  const keyPath: keyof IdbTrack = 'id';

  if (oldVersion < 5 || !transaction) {
    try {
      db.deleteObjectStore(dbStoreTracks);
    } catch {
      // ignore
    }
  }

  const store = createStoreIfMissing(dbStoreTracks, db, transaction, {keyPath});

  createIndexIfMissing(store, keyHash, {unique: true});
  createIndexIfMissing(store, keyPerformer, {unique: false});
  createIndexIfMissing(store, keyPerformerHash, {unique: false});
  createIndexIfMissing(store, keyTitle, {unique: false});
  createIndexIfMissing(store, keySource, {unique: false});
  createIndexIfMissing(store, keyTimestamp, {unique: false});
}

function upgradeDb(idb: IDBDatabase, transaction: IDBTransaction | null, oldVersion: number): void {
  upgradeStoreTracks(idb, transaction, oldVersion);
}

export const idb$ = idbOpenRequest$('ddchords', dbVersion, upgradeDb);

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
      const oldTrack: IdbTrack | undefined = this.result;
      if (oldTrack?.hash === track.hash) {
        sub.next(false);
      } else {
        const idbTrack: IdbTrack = {...track, playlists: oldTrack?.playlists, source, timestamp: new Date().getTime()};

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

export function getPerformer$(db: IDBDatabase, id: string | null): Observable<Performer | null> {
  return !id
    ? of(null)
    : new Observable((sub) => {
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

        const index = trans.objectStore(dbStoreTracks).index(keyPerformerHash);
        const getRequest = index.get(id);
        getRequest.onerror = function onerror(ev): void {
          ev.stopPropagation();
          sub.error(new Error(`IDB transaction get error: ${this.error}`));
        };

        getRequest.onsuccess = function onsuccess(): void {
          const track: Track = this.result;
          sub.next(
            track && track.performer && track.performerHash ? {performer: track.performer, performerHash: track.performerHash} : null,
          );
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

export function getPerformers$(db: IDBDatabase, query: PerformersFilter): Observable<Performer[]> {
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
    const cursor = index.openCursor(null, 'next');
    cursor.onerror = function onerror(ev): void {
      ev.stopPropagation();
      sub.error(new Error(`IDB transaction cursor error: ${this.error}`));
    };

    const collection = new Map<string, string>();
    cursor.onsuccess = function onsuccess(): void {
      if (this.result) {
        const performer = this.result.key.toString();
        if (!collection.has(performer)) {
          const track: Track = this.result.value;
          if (queryStringValue(query.query, performer) && (!query.favorites || track.playlists?.includes(queryPlaylistFavorites))) {
            collection.set(performer, track.performerHash ?? '');
          }
        }
        this.result.continue();
      } else {
        sub.next(
          [...collection.entries()].map<Performer>(([performer, performerHash]) => ({performer, performerHash})),
        );
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

export function getTrackHashes$(db: IDBDatabase): Observable<Set<string>> {
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

    const cursor = trans.objectStore(dbStoreTracks).index(keyHash).openCursor(null, 'next');
    cursor.onerror = function onerror(ev): void {
      ev.stopPropagation();
      sub.error(new Error(`IDB transaction cursor error: ${this.error}`));
    };

    const collection = new Set<string>();
    cursor.onsuccess = function onsuccess(): void {
      if (this.result) {
        collection.add(this.result.key as string);
        this.result.continue();
      } else {
        sub.next(collection);
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

export const trackToTrackMeta = (ii: Track): TrackMeta => ({id: ii.id, performer: ii.performer, title: ii.title});

export function getTrackMetas$(db: IDBDatabase, query: TracksFilter): Observable<TrackMeta[]> {
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

    const cursor = trans.objectStore(dbStoreTracks).index(keyTitle).openCursor(null, 'next');
    cursor.onerror = function onerror(ev): void {
      ev.stopPropagation();
      sub.error(new Error(`IDB transaction cursor error: ${this.error}`));
    };

    const collection: TrackMeta[] = [];
    cursor.onsuccess = function onsuccess(): void {
      if (this.result) {
        const track: Track = this.result.value;
        if (
          filterStringValue(query.performerHash, track.performerHash) &&
          queryStringValue(query.query, track.title) &&
          (!query.favorites || track.playlists?.includes(queryPlaylistFavorites))
        ) {
          collection.push(trackToTrackMeta(track));
        }
        this.result.continue();
      } else {
        sub.next(collection);
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

export function getTrack$(db: IDBDatabase, id: string): Observable<Track | null> {
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

    const request = trans.objectStore(dbStoreTracks).get(id);
    request.onerror = function onerror(ev): void {
      ev.stopPropagation();
      sub.error(new Error(`IDB get request error: ${this.error}`));
    };

    request.onsuccess = function onsuccess(): void {
      sub.next(this.result ?? null);
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

export function toggleTrackPlaylist$(
  db: IDBDatabase,
  id: string | undefined | null,
  playlist: string | undefined | null,
): Observable<boolean> {
  return new Observable((sub) => {
    if (!id || !playlist?.trim()) {
      sub.error(new Error(`Toggle playlist error: invalid id or playlist.`));
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
    const request = store.get(id);
    request.onerror = function onerror(ev): void {
      ev.stopPropagation();
      sub.error(new Error(`IDB get request error: ${this.error}`));
    };

    request.onsuccess = function onsuccess(): void {
      const track: IdbTrack | undefined = this.result;
      if (!track) {
        sub.next(false);
      } else {
        const curPlaylist = playlist.trim();
        const oldPlaylists = (track.playlists ?? '').split(separatorPlaylists).filter((ii) => ii?.length);
        const indexFound = oldPlaylists.indexOf(curPlaylist);
        const newPlaylists =
          indexFound >= 0 ? oldPlaylists.filter((ii, index) => index !== indexFound) : [...oldPlaylists, curPlaylist].sort();
        track.playlists = `${separatorPlaylists}${newPlaylists.join(separatorPlaylists)}${separatorPlaylists}`;
        store.put(track);
        sub.next(true);
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

export const toggleTrackFavorite$ = (db: IDBDatabase, id: string | undefined | null) => toggleTrackPlaylist$(db, id, playlistFavorites);
