**Status: the Angular 22 upgrade (G6) and the Angular 22 cleanup pass are both merged into `main`.
Nothing is in progress.** The one outstanding gap is the browser DI smoke test at
`https://127.0.0.1:4200` — the 42 ng-mocks specs never build the real DI graph, so the 23
`InjectionToken` factories in `src/app/di` stay uncovered. It is not merge-blocking.

Last updated: 2026-11-09 · Repo: `C:\develop\github\dd-chords-pwa` · Branch: `md-cleanup`
(docs-only cleanup) · HEAD: this docs commit, on top of `e87f015` · Tree: clean · Pushed: yes

# Active goals

| Goal | Status | Notes |
| --- | --- | --- |
| G1 — Load path + playlist model in working order | **done** | Playlist directive, `track-list-*`, `track.service.ts`. See `docs/ARCHITECTURE.md` |
| G2 — Data loads correctly, offline included | open | = M1. Needs a design decision, not just code |
| G3 — Playlist management UI | open | no milestone yet; `playlists`/`playlist` in `music-model.ts` are vestigial — only `track.playlists` survives |
| G4 — PWA + production + security + a11y | **done** | |
| G5 — Maintain the app | open | M3 done, M2 pending |
| G6 — Angular 19 → 22 | **done, merged** | at 22.2.x, gates green |

# Milestones

| # | Milestone | State | Evidence |
| --- | --- | --- | --- |
| M1 | Offline first-load + sync | **pending** | `track-import-watch.directive.ts` gates on `online`; nothing in `ngsw-config.json` caches `/assets/dd-chords/**` → cold offline gets 0 tracks, never syncs. Check whether `@angular/pwa`'s default install already caches the dataset |
| M2 | Playlists survive IDB version bump | **pending** | `music-idb.ts` `dbVersion = 5`; `upgradeStoreTracks` deletes `tracks` at `oldVersion < 5` → full wipe. Nothing backs up playlists; they live only in IDB |
| M3 | CacheService version gate | **done** | `(cachedMap?.version ?? 0) >= cachedMapVersion` + `init(cachedMap?.value?.[key])`. No spec covers `CacheService`, so the restore path is untested |
| M4 | Fix flakiness | **done** | 3 suites / 42 tests, `--logHeapUsage` 326 MB |
| M5 | Remove or repair `@ngneat/ngts` | **done** | `@ngneat/eslint-plugin-no-unsaved` was the only live consumer; `src/` imports it in 0 files, so it and `@ngneat/spectator` are gone. The `@ngneat/ngts` build error was esbuild reading `.angular/cache`, not a dependency — see AGENTS.md §4 |
| M6 | Update dev dependencies | **done** | eslint 9.40, @angular-eslint 22.2.2, jest 30.2, typescript 5.9.3 |
| M7 | Firebase Hosting: SPA rewrite vs functions | **pending** | `firebase.json` has `rewrites: [{"source": "/function/**", "destination": "/index.html"}]` + `functions/` with a `beforeChange` trigger. Decide: drop `functions/` (`firebase deploy --only hosting`) or exclude `/function/**` from the rewrite |
| M8 | Decide on Sentry | **pending** | No `sentry-cli` step, no `sentry release`, no `.gitignore` entry for it. Decide whether `sentry.properties` should exist |

# Next steps

1. Browser DI smoke test (`pnpm start`, open `https://127.0.0.1:4200`) — the only step that
   exercises the real DI graph. Nothing else in this list is blocked by it.
2. M1 — decide whether offline first-load is a design gap or a defect, then fix or accept it.
3. Travis: `.travis.yml` pins `node: 18`, but `package.json` declares
   `"engines": {"node": "^20.19.0 || ^22.14.0 || ^24.0.0"}` and Angular 22 needs ^20.19.0. Pin it
   to node 22 or 24.
4. Open the loose ends: cache/M2 policy (`upsertTrack$` preserves local playlists, which nothing
   backs up); a `CacheService` spec; `dd-chords.json`'s 214-entry index; whether the directive's
   `distinctUntilOnChange()` is load-bearing.
5. `update-legacy` is still in `package.json` — Angular 22's `ng update @angular/core` warns it
   cannot detect legacy code here. Run it once and either record the output or delete the script.
6. M7, M8.

# Notes

- **Gates baseline** (a docs-only commit must keep them green): `pnpm exec tsc --noEmit -p
  tsconfig.json` 0 errors; `pnpm test` 3 suites / 42 tests / 1 snapshot; `pnpm lint` clean;
  `pnpm build` 421.05 kB initial / 111.45 kB transfer.
- **Audit**: 68 findings — 9 low / 21 moderate / 37 high / 1 critical, all dev toolchain. The
  critical is `proxy-addr` GHSA-jqcg-44mw-7w3h (IP spoofing, patched ≥2.0.8), reached only through
  dev-only `express`. `pnpm audit --prod` = 0 advisories: the shipped runtime is clean. The
  18-package list is in AGENTS.md §4; CI does not run audit.
- **Dependency state**: builder is `@angular/build`, not devkit. `@angular/animations` and
  `@angular/forms` are in `package.json` but imported by nothing in `src/` — removable, not yet
  done. pnpm is pinned at 11.8.0. `pnpm-workspace.yaml`'s esbuild `allowBuilds` entry is
  load-bearing: fix its comment, never the entry.
- `src/assets/dd-chords/dd-chords.json` is a build artifact and gitignored — regenerate with
  `pnpm generate-chords-index`, never hand-edit. The dataset is the 10 `.txt` files beside it.
- `.travis.yml` runs `pnpm test && pnpm build` and deploys to Firebase on `main`; it is live CI.
- Context protocol (64k window, checkpoint at ~50%) and Windows/PowerShell gotchas: AGENTS.md §1.

# History

Not recorded here — `git log --oneline`.
