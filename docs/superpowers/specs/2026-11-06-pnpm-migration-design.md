# pnpm migration — design

Date: 2026-11-06. Branch: `pnpm-migration` (worktree `2603db/pnpm-migration`).

## Goal

Move `dd-chords-pwa` from npm to pnpm in one branch, covering four things the user wants:

1. Faster installs + less disk space.
2. Stricter dependency tree (no undeclared/phantom dependencies).
3. Reproducible CI.
4. Security layer: install/post-build scripts blocked by default, allow-listed per package.

No functional change to the app: same dependency versions, same build output, same tests.

## Approach

Lockfile-preserving swap (`pnpm import`), not a fresh resolve. A fresh resolve would silently
upgrade Angular 19.0.x→19.2.x and everything else, turning a package-manager change into a
dependency change and making regressions undebuggable. `pnpm import` converts
`package-lock.json` → `pnpm-lock.yaml` preferring the versions already in the source lockfile;
`package-lock.json` is then deleted in the same branch.

The strict posture lives in this branch rather than a follow-up: the migration commits and the
policy commits are ordered separately, so `git bisect` can tell a dependency-resolution problem
apart from a config problem.

## Where pnpm config lives (pnpm 11)

pnpm ≥ 11 reads project settings from `pnpm-workspace.yaml`; `.npmrc` is only for auth/registry/TLS/proxy.
Settings that name machine-level state (`stateDir`, `pnpmHomeDir`, `bin`, `dir`) are **ignored in
`pnpm-workspace.yaml`**, so nothing machine-specific goes in the repo file. The repo file carries
only per-project policy:

```yaml
allowBuilds:                      # per-package install-script permission
  esbuild: true                   # @angular-devkit/build-angular → esbuild binary
  '@parcel/watcher': true         # dev file watcher native binding
  lmdb: true                      # esbuild-based cache backend
  msgpackr-extract: true          # serialization native binding
  fsevents: true                  # macOS watcher (no-op on Linux/Windows)
engineStrict: true                # respect package engines, hard error
strictPeerDependencies: true      # peer warnings become errors
```

Everything else stays at pnpm 11's secure defaults: `strictDepBuilds: true` (any unlisted package
with a build script aborts the install), `blockExoticSubdeps: true`, `minimumReleaseAge: 1440`. No
`dangerouslyAllowAllBuilds`, no extra supply-chain knobs — the defaults are already the secure posture.

`allowBuilds` entries are the *only* allow-list: five packages that genuinely need their install
script. Anything else reports `Ignored build scripts: …` and stays blocked.

## package.json

- `"packageManager": "pnpm@11.8.0"` — corepack picks the exact pnpm version in CI and locally.
- `"engines": {"node": "^22.0.0 || ^24.0.0"}` — matches `@angular/build`'s requirement and the
  local Node (v24.17.0); Travis pins Node 22.
- Declares two packages the code uses but never declared: `rimraf@5.0.10` (used by `prebuild`) and
  `@eslint/js@9.18.0` (`eslint.config.js` requires it). These are fatal under pnpm's strict layout:
  npm's hoisted `node_modules` happens to make them resolvable today.
- Scripts stop chaining through `npm run` (`pnpm run`), so the whole chain works under pnpm.
- `https@^1.0.0` (a bogus Node-core-module shim) is left alone — out of scope for this branch.

## CI (.travis.yml)

`corepack enable` + `corepack prepare pnpm@11.8.0 --activate`, then `pnpm install --frozen-lockfile`,
`pnpm test`, `pnpm build`. Travis caches pnpm's default Linux paths — `$HOME/.cache/pnpm`
(metadata) and `$HOME/.local/share/pnpm/store` (content-addressable store) — so a cached install is
hard-link, i.e. effectively zero network transfer and near-zero disk work.

`firebase-tools` stays a global npm install and the deploy step (`firebase deploy`) stays npm-based:
it is only ever used in CI, keeps its `re2` install-script chain out of the app tree, and needs no
allow-list entry. The redundant global `@angular/cli` install is dropped — `@angular/cli` is already
a devDependency and Travis runs `pnpm build` via the local binary.

## Repo hygiene

- `.gitignore`: add `.pnpm-store/`, `pnpm-debug.log*`.
- Docs (`README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`) get the `pnpm` command equivalents;
  `docs/LEDGER.md` gets the new goal and the branch/HEAD stamp.

## Verification

1. Version parity: resolved versions in `pnpm-lock.yaml` match `package-lock.json` (compare
  `npm ls --depth 0` output against `pnpm ls --depth 0` before removing `package-lock.json`).
2. `pnpm install --frozen-lockfile` from a *clean* `node_modules` (npm layout removed first) — this
  is the check that the strict layout really works.
3. `pnpm test` (3 suites / 42 tests / 1 snapshot) + `pnpm lint` + `pnpm build`.
4. A cold install in a fresh directory after `package-lock.json` is gone.

## Non-goals

- No dependency upgrades, no `pnpm audit` remediation (npm reports 90 vulnerabilities today; that's
  a separate, deliberate change).
- No `overrides`/peer pinning (only needed if `strictPeerDependencies` actually complains).
- No workspace/multi-package restructuring — the file is a project policy file, not a workspace list.
- No changes to `ngsw-config.json`/`angular.json`/`jest.config.ts` unless the cold install proves otherwise.
