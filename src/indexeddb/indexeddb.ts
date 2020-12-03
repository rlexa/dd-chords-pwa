import {Observable} from 'rxjs';

export function idbOpenRequest$(name: string, version: number, fnUpgrade: (idb: IDBDatabase) => void): Observable<IDBDatabase> {
  return new Observable<IDBDatabase>((sub) => {
    if (!('indexedDB' in window)) {
      sub.error(new Error('IndexedDB not supported.'));
      return;
    }
    if (!name?.length) {
      sub.error(new Error('IndexedDB needs a name.'));
      return;
    }
    if (version < 0) {
      sub.error(new Error('IndexedDB needs a version.'));
      return;
    }
    if (typeof fnUpgrade !== 'function') {
      sub.error(new Error('IndexedDB needs an fnUpgrade function.'));
      return;
    }

    const idbOpenDbRequest = indexedDB.open(name, version);

    idbOpenDbRequest.onerror = function onerror(): void {
      sub.error(new Error(`IDB open request error: ${this.error}`));
    };

    idbOpenDbRequest.onblocked = function onblocked(): void {
      sub.error(new Error(`IDB open request blocked: maybe close other tabs using it?`));
    };

    function provideIdb(val: IDBDatabase): void {
      // If another page requests a version change then close the db (else won't happen until tab is closed).
      // This allows the other page to upgrade the database.
      val.onversionchange = (ev) => {
        val.close();
        alert(`A new version of IDB is ready (please reload).`);
      };
      sub.next(val);
      sub.complete();
    }

    idbOpenDbRequest.onsuccess = function onsuccess(): void {
      provideIdb(this.result);
    };

    idbOpenDbRequest.onupgradeneeded = function onupgradeneeded(): void {
      console.log(`IDB upgrading to ${name}.${version}`);
      fnUpgrade(this.result);
      sub.error(new Error(`IDB upgrade done - reloading page...`));
      setTimeout(() => window.location.reload(), 10);
    };

    return () => {};
  });
}
