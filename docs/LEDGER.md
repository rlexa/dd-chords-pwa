# LEDGER — handoff state

**Read me first, always.** This file is the only durable record of project state. Chat history is not.
Rules live in [`AGENTS.md`](../AGENTS.md); this file holds state only.

- **Hard cap: ~120 lines.** If an edit pushes it over, compress closed milestones into `History` and drop stale `Notes`.
- Update **before** a session ends and **before** any context reset. One line per item, no prose essays.
- Stamp the date on every edit. Anything older than a month gets re-verified against the repo.

`Last updated: 2026-11-07` · `Branch: angular-22` · `HEAD: the tip of angular-22, this ledger commit` (hop 2 done, v21.2.x; hop 3 surveyed, no edits yet) — before it: hop 2 `e8ce181`/`64e5315`/`716b023`, ledger `a0d49c6` · `Clean tree: yes` · Working in worktree `C:\Users\alexe\.local\share\opencode\worktree\2603db\angular-22` (design doc: `C:\Users\alexe\.opencode\plan\angular-22-upgrade.md`)

## Active goals

| # | Goal | Status |
| --- | --- | --- |
| G1 | Agent handoff protocol + project docs (`AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/LEDGER.md`) | done, committed `472e0bb` on `progress` |
| G2 | Make offline installs able to resync assets (`ngsw-config.json` covers no `/assets/dd-chords/**`) | proposed, not started |
| G3 | Test coverage for the load pipeline (`TrackImportWatchDirective`, `src/music/music-idb.ts`) | proposed, not started |
| G4 | Move the repo from npm to pnpm (lockfile, scripts, build-script allow-list, CI, docs) | **done** — merged into `main` as `892677e` (fast-forward) on user's choice; merged result re-verified green |
| G5 | Dependency update pass (incl. deciding the unused `https` devDependency, currently kept) | proposed, not started — user signalled 2026-11-06 |
| G6 | Upgrade Angular 19.0.6 → 22.2.x (worktree `angular-22`, staged hops 20→21→22), gates green, zoneless test env | in progress — hops 1–2 done (now on 21.2.x, gates green), hop 3 surveyed, edits pending |

## Milestones

| ID | Milestone | Status |
| --- | --- | --- |
| M0 | Docs + ledger + handoff protocol authored against verified repo facts | done — committed `472e0bb`; this ledger stamp is the follow-up commit |
| M1 | Asset sync survives offline / cold install (add `dd-chords` group to `ngsw-config.json`, or drop the `DiOnline` gate) | open |
| M2 | Specs for `upsertTrack$` / `toggleTrackPlaylist$` / import directive (ng-mocks + `toMatchSnapshot`) | open |
| M3 | Fix `CacheService` version-gate precedence bug (`?? 0 >= cachedMapVersion`, `cache.service.ts:54`) | open, blocked on user call |
| M5 | Angular 19→22 upgrade (G6) — one goal per hop, each hop = dep bump + migrate + forced edits + gates + commit | **hops 1–2 done**: baseline `7074ca4`; hop 1 `c19c517`+`e3adcdb`; hop 2 `e8ce181`+`64e5315`+`716b023`. Hop 3 open — surveyed (targets + migrations pinned in Notes), edits pending |

## Next steps

Small goals, one commit each, and stamp this ledger after every one (not only at hop boundaries). Each gate line is `pnpm test` → `pnpm lint` → `pnpm build`.

1. **G6 hop 3a — dep bump to 22.2.x** (survey done 2026-11-07, edit not applied yet): `@angular/{animations,common,compiler,core,forms,platform-browser,platform-browser-dynamic,router,service-worker}` → `^22.2.5`, `@angular/cdk` → `^22.2.6`, `@angular/{cli,devkit/build-angular}` → `^22.2.6`, `angular-eslint` → `22.6.0`, `typescript` → `~6.0.3`. Keep `eslint ^9.18.0` (angular-eslint 22 peers `^9 || ^10` — an eslint major bump is out of scope for the Angular hop), `@types/node`, `jest`, `jest-environment-jsdom`, `jest-preset-angular`, `ng-mocks` unchanged. Then `pnpm install` (strict peers must stay clean) → commit manifest + lockfile → `ng update @angular/core --migrate-only --from 21.2.26 --to 22.2.5` (**install first, migrate after**: the installed package then already matches the target, so ng creates no `.angular/cache/angular-cli-tmp-packages-*`; `git checkout -- pnpm-lock.yaml` if it gets touched anyway). Review what the 8 migrations touch rather than trusting them.
2. **G6 hop 3b — forced edits**: whatever the migrations don't do — TS 6.0 tsconfig fallout (`tsconfig.json`/`.app.json`/`.spec.json`: `target: ES2022`, `module: es2020`, `moduleResolution: bundler`, `useDefineForClassFields: false`), the eager/OnPush change-detection default landing in `MusicComponent` and the ng-mocks spec, `@angular/platform-browser-dynamic` removal from `main.ts`/test env, `engines` `^22.22.3 || ^24.15.0 || >=26.0.0` (CLI 22 engines, read from a scratch install — re-read `node_modules/@angular/cli/package.json` after hop 3a before setting it; local Node is 24.17.0 so it satisfies `^24.15.0` either way). Karma/protractor targets are moot — `angular.json` has only `extract-i18n` + build/test (verified 2026-11-07). Gate green, commit.
3. **G6 hop 3c — optional `control-flow-migration`** (`ng generate control-flow-migration`), then one snapshot review pass — judge the diff, don't regenerate blindly. Commit only if it changes source; else leave it out and record that.
4. **G6 hop 3d — cleanup**: drop `@angular/platform-browser-dynamic` from `package.json` once nothing imports it, set `engines` to `^22.22.3 || ^24.15.0 || >=26.0.0` (matching hop 3b), re-record `pnpm audit` numbers in `AGENTS.md` §4. Gates + ledger stamp + commit.
5. **G6 close** — full gates on the final HEAD, ledger stamp, then offer the merge choice (`finishing-a-development-branch`).
6. **G5** — dependency pass: decide the `https` devDependency (D5), the Travis double-install gap (`install: true`), re-confirm the audit findings.
7. **Ask the user** whether M1–M3 are wanted. M3 (`CacheService` precedence bug, `cache.service.ts:54`) changes cached-state behaviour, so it needs their call.
8. **If M1 approved** — patch `ngsw-config.json` with an assets group for `/assets/dd-chords/**` (needs a `maxAge`/`freshness` call; the index is a build artifact so stale-while-revalidate fits).

## Decisions

- **D1** — Ledger is `docs/LEDGER.md`, git-tracked, size-capped; `AGENTS.md` makes it the mandatory first read. Chosen over putting state inside `AGENTS.md` (mixes durable instructions with mutable state) and over keeping it outside the repo (no history, no review).
- **D2** — `dd-chords.json` stays a build artifact, gitignored, regenerated by `pnpm run generate-chords-index` inside `prebuild`. Never hand-edit it.
- **D3** — Work through subagents one at a time, read-only, compact reports; the main session keeps only the distilled result. **Superseded 2026-11-06:** the user directed all reviews/verification to run inline in the main session instead.
- **D4** — npm→pnpm swap keeps lockfile versions: `pnpm import` seeds `pnpm-lock.yaml` from `package-lock.json`, then `package-lock.json` is deleted — no fresh resolution (would silently bump Angular 19.0.6). Policy lives in `pnpm-workspace.yaml` (pnpm 11), never `.npmrc`; `allowBuilds` lists only the 5 packages whose build scripts actually run (`esbuild`, `@parcel/watcher`, `lmdb`, `msgpackr-extract`, `fsevents`). `firebase-tools` stays npm-global in Travis, out of the app tree.
- **D5** — Keep the `https` devDependency (`package.json:51`, declared, unused, a real registry package rather than Node's built-in): the user decided 2026-11-06 to keep it for now and revisit it in a later dependency update (G5). Not part of the pnpm migration's scope.

## Notes

- G6 worktree `angular-22` branched from `main`@`9923432`; the root checkout is untouched on `main`. Design doc lives outside the repo at `C:\Users\alexe\.opencode\plan\angular-22-upgrade.md`. Verified 2026-11-06 in the worktree: `pnpm install` fresh, v19.0.6 baseline green — `pnpm test` 3 suites/42 tests/1 snapshot, `pnpm lint` clean, `pnpm build` PASS.
- G6 hop 2 facts (verified 2026-11-06): Angular 21 ships `@angular/core` types only via the `exports` map (`types/testing.d.ts`), so `tsconfig.json` `moduleResolution` must be `bundler` — Node10 resolution gives `TS2307` on `@angular/core/testing`, which surfaces as ng-mocks' `Property 'detectChanges' does not exist on MockedComponentFixture`. Pnpm's strict layout also dropped `jest-environment-jsdom` (it had been a transitive peer under npm) → `ReferenceError: WindowContext is not defined`; fixed by declaring it explicitly (`^30.5.2`), not by a `breakContext` hack (that workaround was tried and reverted — tests are green without it).
- Models used for subagent work: implementers `opencode/deepseek-v4.1-flash-free#high`, reviewers `opencode/glm-5.3-flash-free#high`. **Superseded 2026-11-06 (D3): all work runs inline in the main session.**
- IDB is `ddchords` v5. Bumping `dbVersion` deletes the `tracks` store and reloads the page → full re-import of all 10 files. Any schema change is a total resync.
- Only 3 specs exist (`app.component`, `music`, `md5`). `jest-global-mocks.ts` makes `console.error` throw — tests fail loudly on logging.
- `key.pem` / `cert.pem` are local-only (gitignored) and both present in the root repo (verified 2026-11-06); `pnpm start` fails without them.
- `.travis.yml` is tracked and deploys to Firebase on `main`; README's "no CI" claim was stale and is now corrected.
- `AGENTS.md` is now auto-loaded by the agent harness as project instructions, so step 0 (read the ledger) applies without anyone having to remember it.
- The G4 worktree (`~/.local/share/opencode/worktree/2603db/pnpm-migration`) and the `pnpm-migration` branch are both gone (branch deleted after the merge; directory deleted on the user's confirmation after verifying every leftover file matched `main`'s blobs). `main` is now pnpm-native (root `node_modules` reinstalled via `pnpm install --frozen-lockfile`, 1055 pkgs). `origin/main` is still at `84cab2c` — pushing is the user's call.
- Baseline verified with npm before the migration: `npm ci` (1174 pkgs) → 3 suites / 42 tests / 1 snapshot, `npm run lint` clean. Toolchain: Node 24.17.0, npm 11.13.0, pnpm 11.8.0, corepack 0.35.0.
- `eslint.config.js` does `require('@eslint/js')` without declaring it — fatal under pnpm's strict layout, so Task 1 adds `@eslint/js` + `rimraf` as devDependencies (versions taken from `package-lock.json`).
- `tslib ^2.8.1` is explicit: `importHelpers: true` needs it; npm hoisting hid the undeclared import (`TS2354`).
- Task 7 acceptance ran green, no commit: `pnpm install` into a removed `node_modules` → `+1055` with no ignored-build warning, `pnpm rebuild esbuild` (0.21.5 and 0.24.0), `pnpm test` 3 suites / 42 tests / 1 snapshot, `pnpm lint` clean, `pnpm build` PASS, lockfile parity 1021 names with no version drift. Evidence: `.superpowers/sdd/2026-11-06-pnpm-migration/task-7-report.md`.
- `AGENTS.md` §4 carries the pnpm audit numbers (215 findings, 6 critical) — they change with hop 3's dependency bump, so re-record them after hop 3 and say so.
- `pnpm audit` (verified 2026-11-06): **215 findings — 22 low / 83 moderate / 104 high / 6 critical**, accepted as-is for this migration. The spec's premise quoted npm's older 90/4-high baseline: `vue` and `lodash` are gone from the advisory set, the criticals are `form-data`, `shell-quote`, `websocket-driver`, `tar`, `piscina`, `proxy-addr`. `AGENTS.md` §4 corrected to the 215/6-critical numbers in this stamp.
- `node_modules` is pnpm's strict layout, 1055 packages (−10.1% vs npm's 1174). Transitive binaries resolve only under `.pnpm/`, so run them with `pnpm exec`; esbuild 0.21.5 (Angular's) and 0.24.0 coexist.
- Hop 3 survey (verified 2026-11-07 against the registry and the installed tree): `@angular/core` group is **22.2.5** — `22.2.6` does not exist (404), so use `--to 22.2.5`. `@angular/cdk` + `@angular/cli` + `@angular-devkit/build-angular` = 22.2.6, `angular-eslint` = 22.6.0. **No peer wall**: `compiler-cli@22.2.5` and `build-angular@22.2.6` want `typescript >=6.0 <6.1` → TS **6.0.3** (7.0.2 is too new), `typescript-eslint@8.72.1` accepts `<6.1.0`, `jest-preset-angular@17.0.3` peers TS `>=5.8` + Angular `>=20 <23`, its `ts-jest` peers `<7`, `ng-mocks@14.18.5` allows `22.0.0-alpha - 22`.
- Hop 3 migration manifest: `node_modules/@angular/core/schematics/migrations.json` (v22 has no root `collection.json`; ng-generate lives in `schematics/ng-generate/`) — 8 migrations, all `version: 22.0.0`: `change-detection-eager`, `http-xhr-backend`, `strict-templates-default`, `can-match-snapshot-required`, `incremental-hydration`, `strict-safe-navigation-narrow`, `model-output`, `safe-optional-chaining`. Expect little or no file churn: `strictTemplates` is already `true`, and there is no SSR/`provideClientHydration` in this app.
- `ng update --migrate-only` rejects several packages at once ("A single package must be specified"), and `--force` does **not** bypass the "Repository is not clean" check — hence hop 3a's commit-before-migrate order.
- Never append to `docs/LEDGER.md` with PowerShell `Add-Content`: its escapes eat `→`, backticks and `\n`, so the ledger gets corrupted (`a`/`b`/`t` → BEL/BS/TAB). Write the whole file with the `write` tool instead, and repair a damaged line with `git checkout -- docs/LEDGER.md`.

## History

`2026-11-06` — Repo surveyed: asset→IndexedDB sync (`TrackImportWatchDirective`) is the whole data-load path; no backend services. Docs + ledger authored from verified reads, nothing overwritten. Previous ledger state: none (file created today).
`2026-11-06` — G1/M0 shipped: `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/LEDGER.md`, `README.md` rewrite committed as `472e0bb` on `progress`. `npm test` (3 suites / 42 tests / 1 snapshot) and `npm run lint` both green before the commit.
`2026-11-06` — G4/M4 Tasks 1–6 executed and approved through the SDD workflow: `8916c71` (package.json), `d794c79` (lockfile swap + `tslib`), `dc9336e` (scripts), `8d558af` (`pnpm-workspace.yaml` policy), `5e17a1d` (Travis via corepack), `4e9e1a0` (docs). Task 7's cold-install acceptance ran green with no commit. This stamp is the resume point: Task 7's task review, then the whole-branch review against `d858db5`.
`2026-11-06` — G4/M4 closed out: Task 7 task review Approved (controller re-verified acceptance against live repo state — 1055 pkgs, parity 1021 names no drift, audit 215/6 critical); whole-branch review vs base `d858db5` **approved inline** (per the user's no-subagent directive), no critical or important findings, minors (Task 3 parity-helper rewrite, `build:watch` dev-default, Task 4 header, Task 6 stale refs) verified resolved; sole review finding — stale audit count in `AGENTS.md` §4 — fixed.
`2026-11-06` — G4 merged: user chose option 1 of `finishing-a-development-branch`, so `main` fast-forwarded `84cab2c`→`892677e` (10 commits, `pnpm-lock.yaml` + `pnpm-workspace.yaml` added, `package-lock.json` deleted). Merged result re-verified green: `pnpm test` 3 suites / 42 tests / 1 snapshot, `pnpm lint` clean, `pnpm build` PASS. Worktree removed, branch deleted.
`2026-11-06` — Workspace cleanup finished: the harness's non-force worktree removal left the directory behind, so it was deleted on the user's confirmation after every leftover file was hash-checked against `main`'s blobs (byte-identical; the only untracked file was the gitignored `dd-chords.json`, identical to the root copy). `git branch -d pnpm-migration` done (`was 892677e`), `git worktree prune` leaves only the root repo. `git status` clean. `pnpm test` re-run on `main`: 3 suites / 42 tests.
`2026-11-06` — User decision: keep the `https` devDependency for now, revisit in a later dependency update → recorded as D5 + G5. Verified unused in this session: no `https` import anywhere under `src/`.
`2026-11-06` — G6/M5 step 1: worktree `angular-22` created from `main`@`9923432`, session moved into it, `pnpm install` fresh, v19.0.6 control baseline green (test 3/42/1, lint clean, build PASS). Next: M5 step 2 (dep bump + `ng update` schematics).
`2026-11-06` — G6/M5 hop 1 → v20: `ng update` refused 19→22 in one go, so the path is staged (19→20→21→22). Deps committed as `c19c517` (Angular 20.3.35, cdk 20.2.14, CLI/build 20.3.42, TS 5.9.3, jest 30.5.2 + preset 17.0.3 + `@types/jest` 30 + ng-mocks 14.18.5 + jsdom 26.1.0 + `@types/node` 22.20.5) — peer-satisfied, no `strictPeerDependencies` override needed. `--migrate-only --from 19.0.6 --to 20.3.35` → zero file changes. Forced edits in this commit: `main.ts` zoneless symbol, `jest-setup.ts` → `setup-env/zoneless`, `jest.config.ts` presets import → `presets/index.js` (Node ESM type-stripping), snapshot header link, `docs/ARCHITECTURE.md` API name. Gates: 42/42, snapshot unchanged, lint clean, build PASS (initial 471.14 kB / transfer 126 kB vs v19's 559 kB / 133 kB). Next: hop 2 → 21.x.
`2026-11-06` — G6/M5 hop 2 → v21: manifest `e8ce181` (@angular/core/compiler 21.2.26, cdk 21.2.14, cli/devkit/build-angular 21.2.29, angular-eslint 21.4.0), lockfile `64e5315` (peer-clean), forced edits `716b023` (`moduleResolution` → `bundler`, explicit `jest-environment-jsdom`). `--migrate-only --from 20.3.35 --to 21.2.26` changed only `tsconfig.json`'s resolution (already applied by the v20 hop). Gates green: 3 suites / 42 tests / 1 snapshot unchanged, lint clean, build PASS (initial 478.26 kB / transfer 127.17 kB). Next: hop 3a (dep bump to 22.2.x).
`2026-11-07` — G6 hop 3 surveyed, no source edits: v22 targets pinned (see Notes), no peer wall, migration list read from `@angular/core/schematics/migrations.json`. `pnpm-lock.yaml` was polluted by ng's temporary `.angular/cache/angular-cli-tmp-packages-*` importer during the probe (this workspace has no `packages:` list in `pnpm-workspace.yaml`) and was reverted with `git checkout --`; tree clean at `a0d49c6`. Scratch probe `Temp\ng22-probe` deleted. Handoff point: hop 3a's `package.json` edit is the first thing to apply.
