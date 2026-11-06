# AGENTS.md

Instructions for coding agents working in `dd-chords-pwa`. Human-facing docs: [`README.md`](README.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 0. First thing, always

**Read `docs/LEDGER.md` before anything else** — before exploring, before editing, before answering questions. It is the source of truth for active goals, milestones, and next steps. Anything you remember from a previous session is not state; the ledger is.

If the ledger and the repo disagree, the repo wins: re-verify with a read, then fix the ledger and say so.

## 1. Context protocol (64k window)

The model driving this repo has a ~64k-token context. Assume it will run out before a task finishes.

**Budget rules**

- Never read a file larger than ~200 lines without an `offset`/`limit`. Never `cat` a whole directory.
- Search with `grep`/`glob` first, then read only what the search pointed to.
- Do not re-read a file you already read this session unless it changed.
- Keep tool output out of the narrative: summarise a 500-line grep into the 3 lines that matter.

**Subagents: yes, one at a time.** `explore`/`general` subagents have their own context, so use them to keep exploration out of the main session.

- Dispatch **one** subagent at a time; wait for its report before dispatching the next.
- Give it a bounded, read-only task ("report the data flow in `src/music/`, under 40 lines, no edits") and take only its conclusion back.
- Anything the subagent concludes that matters → write it into the ledger, not just the chat.
- If a subagent report looks larger than the ask, that is a signal the main session is filling up: checkpoint (below) instead of continuing.

**Checkpoint when context passes ~50%.** Context resets are not recoverable from. When you approach the limit — or the user says "context is getting full" — write the ledger's `Active goals` / `Next steps` / `Notes` to reflect where things actually stand, say "ledger updated, ready to resume in a fresh session", and stop. A fresh session then re-enters at step 0.

**Closing a session:** update the ledger (`Last updated`, `Branch`, `HEAD`, clean-tree flag), commit it with the work it describes, then stop. Never leave the ledger describing uncommitted work without saying so in `Milestones`.

## 2. Commands

```
npm run build:watch     # watch-build into dist/  (dev mode)
npm start               # express server over https://127.0.0.1:4200  — needs key.pem + cert.pem (gitignored, local only)
npm test               # jest --ci --logHeapUsage
npm run test:dev        # jest --updateSnapshot --bail --runInBand  (regenerate snapshots)
npm run test:watch
npm run lint            # ng lint
npm run build           # production build; prebuild = rimraf dist && generate-chords-index
npm run generate-chords-index   # regenerates src/assets/dd-chords/dd-chords.json (md5 hash index)
```

`src/assets/dd-chords/dd-chords.json` is a **build artifact**, gitignored. Regenerate it; never hand-edit it. The dataset is the 10 `.txt` files beside it.

## 3. Conventions (match the surrounding code)

- Angular 19, standalone components/directives only, `ChangeDetectionStrategy.OnPush`. No NgModule. Zoneless change detection.
- Reactive via rxjs (`takeUntilDestroyed(inject(DestroyRef))`, `@Input()` setters, `BehaviorSubject`/`StateSubject`). Signals exist only in `MusicComponent`'s local view state — don't reach for them elsewhere.
- Shared state lives in `InjectionToken`s under `src/app/di/*.di.ts`, named `DiXxx`, `providedIn: 'root'`, factories returning `Observable`s or subjects. `src/app/di/active/*` is mutable app state.
- Data layer (`src/music`, `src/indexeddb`, `src/util`) is framework-free: rxjs functions wrapping raw IDB callbacks. App code talks to it through services (`TrackService`), never directly.
- Barrel `index.ts` per folder; absolute imports (`src/app/...`, `src/music/...`) — `baseUrl` maps `src/`.
- Selectors: components `dd-chords-*` (kebab), directives `ddChords*` (camel). Enforced by eslint; failing lint is a build break.
- Prettier: `printWidth: 140`, `bracketSpacing: false`, single quotes, organize-imports. `tsconfig` is `strict` + `strictTemplates`.
- Tests: Jest + `jest-preset-angular` (CJS preset) + ng-mocks (`MockBuilder`/`MockRender`) with `toMatchSnapshot()`. Snapshots live in `__snapshots__`.
- Routing: lazy `loadChildren`/`loadComponent` in `src/app/feature/*/routes.ts`; route/query names are constants in `src/app/routing.ts`.

## 4. Landmines

- **IDB version bump = full resync.** `src/music/music-idb.ts` `dbVersion` (currently 5): `upgradeStoreTracks` deletes the `tracks` store at `oldVersion < 5`, and `src/indexeddb/indexeddb.ts` reacts to a version error with `setTimeout(() => window.location.reload(), 10)`. Bumping it wipes and re-imports every track.
- **`upsertTrack$` preserves local playlists.** On a changed hash it re-writes the track but keeps `oldTrack.playlists` (user favourites live only in IDB — nothing backs them up).
- **The whole load path is one directive.** `src/app/shared/track-import-watch/track-import-watch.directive.ts`, applied on `<router-outlet>` in `app.component.ts`. Gate → index → hashes → fetch mismatches → `TrackService.saveTrack$('builtin', …)`. There is no backend.
- **Offline never syncs.** The directive gates on `filter(online)` and `ngsw-config.json` caches nothing under `/assets/dd-chords/**`, so a cold offline install gets no data and no resync. (Ledger M1.)
- **`CacheService` version gate is wrong.** `cache.service.ts`: `if (cachedMap?.version ?? 0 >= cachedMapVersion)` — precedence, not `??`. Fixing it changes cache-eviction behaviour. (Ledger M3.)
- **`console.error` throws in tests** (`src/jest-global-mocks.ts`); `Date.now`/`Math.random` are pinned. A test that logs fails.
- `.travis.yml` runs `npm run test && npm run build` and deploys to Firebase on `main`. It is live CI, not decoration.

## 5. Don't

- Don't add a backend, or move track data out of IndexedDB, without the user's explicit go-ahead.
- Don't edit `dd-chords.json` by hand, don't commit `.pem` files, don't reformat files outside your change.
- Don't invent goals or mark ledger milestones done without evidence (a passing command, a diff) in this session.
