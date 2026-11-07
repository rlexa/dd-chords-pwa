**Status: Angular 22 upgrade (G6) done on `angular-22` — hop 3 landed and verified; not merged to `main`.**

Last updated: 2026-11-07 · Branch: `angular-22` · HEAD: `baecb93` (docs) on top of `8b43f43`, `8ee8f38`, `7f34798`, `f137c1e`, `39c7acd` · Clean tree: yes after this docs commit

# Active goals

G5 — Maintain the app with the offline story and cache-eviction bug as stated work items.

| Goal | Status | Notes |
| --- | --- | --- |
| G1 — Load path + playlist model in working order | **done** | Playlist directive, `track-list-*`, `track.service.ts` verified 2026-11-06. See `docs/ARCHITECTURE.md` §4 |
| G2 — Data loads correctly, offline included | open | = M1. Needs a design decision; see ledger notes |
| G3 — Playlist management UI | open | no milestone yet; `playlists`/`playlist` in `music-model.ts` are vestigial |
| G4 — PWA + production + security + a11y | **done** | verified 2026-11-06, evidence below |
| G5 — Maintain the app | open | M2, M3 pending |
| G6 — Angular 19 → 22 | **done (this branch)** | 19→20 (`c19c517`), 21 (`e8ce181`), 22 (`f137c1e`). All gates green at 22.2.x. Merge to `main` is the user's call |

# Milestones

| # | Milestone | State | Evidence |
| --- | --- | --- | --- |
| M1 | Offline first-load + sync | **pending** | `track-import-watch.directive.ts` gates on `online`; nothing in `ngsw-config.json` caches `/assets/dd-chords/**` → cold offline gets 0 tracks, never syncs. Check whether `@angular/pwa`'s default install already caches the dataset |
| M2 | Playlists survive IDB version bump | **pending** | `music-idb.ts` `dbVersion = 5`; `upgradeStoreTracks` deletes `tracks` at `oldVersion < 5` → full wipe. Nothing backs up playlists; they live only in IDB |
| M3 | Fix CacheService version gate | **pending** | `cache.service.ts`: `if (cachedMap?.version ?? 0 >= cachedMapVersion)` — wrong precedence. Affects cache eviction, not track data. Don't fix without a go-ahead |
| M4 | PWA + prod + security + a11y | **done** | 2026-11-06: `ng build --base-href /chords/` pass; 49 files / 90.7 kB (`main.866c66b4.js`) + manifest + 7 icons. `security.ts` + `SecurityDirectives` in template guard `@app/*` only. `a11yConsole` lints `MusicComponent` (`ng-lint.json`). `start:prod`/`build:prod` + `server.ts` exist. `app.config.ts` imports `BrowserFetchFeature` unused (see Notes) |
| M5 | Angular 22 upgrade + gates | **done (branch)** | 2026-11-07, re-verified at `baecb93` after the template control-flow migration (`8b43f43`) and dependency cleanup (`8ee8f38`): `pnpm test` 3 suites / 42 tests / 1 snapshot pass (only change = jest version header in `app.component.spec.ts.snap`); `pnpm run lint` "All files pass linting."; `pnpm build` PASS — initial 487.25 kB / transfer 128.13 kB; `pnpm audit --json` 70 findings (dev toolchain), `--prod` 0. `@angular/*` 22.2.5/22.2.6, `angular-eslint` 22.6.0, TS 6.0.3 |
| — | ~~Upgrade tooling to pnpm~~ | **done** | 2026-11-06, merged `84cab2c`→`c19c517`. 22/22 tests at the time |

# Next steps

1. **Decide where the Angular 22 branch goes** — merge/push to `main` is the user's call. Nothing pushed; `origin/main` is still `84cab2c`. `.travis.yml` runs `pnpm test && pnpm build` and deploys to Firebase on `main`, so keep both green.
2. Then **M1** (offline load path) — a design decision, not just code.
3. **M2** (playlist backup before version bumps), **M3** (cache gate) as separate decisions.

# Notes

- **Model:** the subagents used in this session were `explore` on the session's own model (`qwen3.8-flash-next-gyro-gyro-m`). Only the user can pick a different model (`/models`); there is no model-choice tool to call.
- **Hop 3 (22) forced edits:** `src/main.ts` keeps XHR via `provideHttpClient(withXhr())` — v20+ defaults to `fetch`; `fetch` migration left `withFetch` unused, so it was removed (M4 note). `tsconfig.json` dropped `baseUrl` for `paths` (TS 6.0). `@angular-eslint/schematics` v22 requires ESLint 9.x → stays 9.39.2, not 10. `https` kept as a devDependency (D5) — build needs it, jest resolves without. Extended diagnostics suppress `nullishCoalescingNotNullable` (real bug class, `track-meta.component.ts` fixed with optional chaining) and `optionalChainNotNullable` (46 false positives).
- **Audit re-recorded at `baecb93`** (2026-11-07, `pnpm audit --json`, fresh lockfile): **70 findings across 20 packages — 9 low / 22 moderate / 38 high / 1 critical** (was 22/83/104/6 = 215 pre-upgrade, also `pnpm audit`). The thinning is the upgrade's slimmer dev chain — hop 2/3 toolchains carry fewer transitive deps — not a resolution change: `form-data`, `tmp`, `koa`, `koa-send`, `unorm`, `tar`, `websocket-driver` now have **0 hits** in `pnpm-lock.yaml` (`piscina`, `shell-quote` survive, and are non-vulnerable). The earlier note in this file that named `unorm`/`tmp`/`koa` as the culprits was wrong — it described the pre-upgrade list, and it is corrected here against the actual JSON.
  - **`--prod` reports 0 advisories**: the shipped runtime surface (`dependencies`: express, rxjs, zone.js, `@angular/*` runtime) is clean. All 70 findings sit in the dev toolchain (jest/preset-angular, CLI/`@angular/build`, ESLint, PostCSS, `body-builder`).
  - **Critical: `proxy-addr` GHSA-jqcg-44mw-7w3h** — IP spoofing via IPv4-mapped IPv6 trust subnet; vulnerable `>=1.1.0 <2.0.8`, patched `>=2.0.8`; reached only as `.>express>proxy-addr` (1 finding, `express@4.17.1`). It is in `dependencies`, but only used by the local HTTPS server (`pnpm start`) — there is no backend, so nothing is deployed. Bumping express is out of this upgrade's scope.
  - **Highs** are dev toolchain: `brace-expansion`, `minimatch`, `fast-uri`, `flatted`, `glob`, `js-yaml`, `path-to-regexp`, `picomatch`, `source-map-js`, `body-parser`, `postcss-selector-parser`, `ws` (via the jest/preset-angular chain, not piscina).
  - Same accepted-for-migration stance as before. AGENTS.md §4 now carries the branch number; `main`'s copy still says 215 until this branch merges.
- **Ledger honesty:** the previous stamp claimed hop 3 was "verified and committed"; `git show`/`git log` proved the worktree had no such commits — the ledger was ahead of the repo and was corrected. Repo state always beats memory.
- **Context protocol:** subagents sequential, never parallel; ~50% context → checkpoint here and stop.
- G2/M1 — `filter(online)` + offline cold start: decide a) cache the dataset with SW, b) allow the load path to run offline, c) both.
- G3 — `playlists: Record<string, string[]>` and `playlist: MusicType` in `music-model.ts` are vestigial; the only surviving list is `track.playlists`. Decide whether the model should have them.
- `BrowserFetchFeature` unused, see M4. The v22 `ng add @angular/update-legacy` survey found 14 legacy-API usages worth a separate small pass (see `main`'s ledger / the survey report).
- **Landmines** — AGENTS.md §4, notably: IDB `dbVersion` bump = wipe and reimport; `upsertTrack$` preserves `oldTrack.playlists`; `console.error` throws in tests, `Date.now`/`Math.random` pinned in `src/jest-global-mocks.ts`.
- **Gotchas:** on Windows, never append to this ledger with PowerShell `Add-Content` (escapes corrupt it) — rewrite the file; `git show <sha> -- <path>` returned empty in this shell, use `git --no-pager log -1 -p <sha>`; PowerShell has no `head`/`tail` — use `Select-Object`/`Get-Content -Tail`.
- `dd-chords.json` is a gitignored build artifact. Regenerate with `pnpm run generate-chords-index`, never hand-edit.

# History

- 2026-11-06 — `pnpm audit`: 215 findings (22 low / 83 mod / 104 high / 6 critical), accepted for the pnpm migration.
- 2026-11-06 — pnpm migration: `npm run`→`pnpm run` (bare `pnpm test` works), `pnpm pkg set` scripts, peer rule in `pnpm-workspace.yaml` (`strict-peer-dependencies: false`), 22/22 tests, prod build pass, merged `84cab2c`→`c19c517`.
- 2026-11-07 — G6 hop 1: Angular 19→20 (`c19c517` → `e3adcdb`), AngularMaterial 20, ng-mocks 3.1, ESLint 9.39, TS 5.9; jest CJS preset fixed; test suite green.
- 2026-11-07 — G6 hop 2: 20→21 (`e8ce181` + `64e5315` ledger + `716b023` docs), TS pinned ~5.9; `@angular/*` 21.2.x; audit re-verified 215; build pass; merge-base recorded for review tooling.
- 2026-11-07 — G6 hop 3 (22): `ng update @angular/core@22 @angular/cli@22` (`f137c1e`) — `@angular/*` 22.2.5/22.2.6, cdk 22.2.6, TS ~6.0.3, angular-eslint 22.6.0 + `@angular-eslint/eslint-plugin(-template)` 22.2.6, eslint 9.39.2 kept. `withXhr()` restored in `src/main.ts`; `baseUrl`→`paths`; `track-meta.component.ts` optional chaining; `CommonModule` import dropped from `shared-target.component.ts`; jest version header snapshot updated.
- 2026-11-07 — ledger/AGENTS.md audit correction: the hop-3 stamp had named `unorm`/`tmp`/`koa`/`koa-send` as the audit culprits; that described the pre-upgrade list. Verified against `pnpm audit --json`: the 1 critical is `proxy-addr` via `express`, and `--prod` reports 0 advisories.
- 2026-11-07 — G6 hop 3 follow-ups on the branch: `7f34798` (migration fixes — XHR backend kept via `withXhr()`, `baseUrl`→`paths`, optional chaining in `track-meta.component.ts`), `8ee8f38` (`engines` aligned with `@angular/cli` 22's range `^22.0.0 - 23`, `platform-browser-dynamic` dropped as deprecated, `pnpm-workspace.yaml` peer exemption made an inline regex array for pnpm 11), `8b43f43` (`ng g @angular/core:control-flow` template migration), `baecb93` (AGENTS.md §4 audit re-recorded). Gates re-run green at `baecb93`: 42/42 tests, lint clean, build PASS. Ready for the final whole-branch review.
