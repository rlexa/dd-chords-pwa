# pnpm migration implementation plan

> **For the executor:** run tasks 1–7 in order, one commit per task, exactly as written. If a step's
> actual output contradicts its expected output, stop and report it — do not invent config changes.
> Bash/PowerShell commands run in the working directory. Use the `write`/`edit` tools for file edits,
> not shell redirection.

**Goal:** Replace npm with pnpm on branch `pnpm-migration` without changing dependency versions, app
code, or deploy behavior.

**Working directory:** `C:\Users\alexe\.local\share\opencode\worktree\2603db\pnpm-migration` — all
paths below are relative to it.

**Branch:** `pnpm-migration` (already checked out, HEAD `84cab2c`). Never commit to `main`; never
push or merge without the user's decision.

**Spec:** `docs/superpowers/specs/2026-11-06-pnpm-migration-design.md`

## Scope & guardrails

- Package-manager config only: no dependency upgrades, no app-source changes, no `pnpm audit`
  remediation, no edits to `angular.json`/`ngsw-config.json`/`jest.config.ts`.
- `allowBuilds` lists only packages pnpm itself reported as ignored and which genuinely need their
  install script. Never use `dangerouslyAllowAllBuilds`, `--ignore-scripts` on the whole install, or
  a global install.
- `git add` only the paths a task names; never `git add -A`.
- Machine-level settings (`storeDir`, `stateDir`, `pnpmHomeDir`, `bin`, `dir`, `ci`) are **ignored**
  in `pnpm-workspace.yaml` (pnpm 11) — never put them in the repo file.
- If `strictPeerDependencies` or an `Ignored build scripts` entry forces a decision beyond the spec,
  stop and report; that is a plan conflict, not something to work around silently.

## Verification after every task (run both, from the working directory)

```
pnpm test    # expected: Test Suites: 3 passed, 3 total / Tests: 42 passed / Snapshots: 1 passed
pnpm lint    # expected: All files pass linting.
```

If a task has its own extra verification step, run that too. Do not mark a task done on a command
that didn't actually pass.

## Baseline (verified before this plan was written)

`npm ci` → 1174 packages; `npm test` → 3 suites / 42 tests / 1 snapshot; `npm run lint` → clean.
Toolchain: Node v24.17.0, npm 11.13.0, pnpm 11.8.0, corepack 0.35.0. Travis pins Node 22.

---

### Task 1 — package.json: declare what the code already uses, pin the package manager

**Files:** `package.json`

- [ ] **Step 1: Add two devDependencies.** `eslint.config.js` does `require('@eslint/js')` and
  `prebuild` runs `rimraf`; neither is declared, and pnpm's strict layout will not resolve them from
  another package's folder. Pin the versions npm already resolved (both are present in
  `package-lock.json` at these exact versions):

  In `devDependencies`, add alongside the existing entries (alphabetically sorted — `@eslint/js`
  before `@types/*`, `rimraf` after `prettier-plugin-organize-imports`):

  ```json
    "@eslint/js": "^9.18.0",
    "rimraf": "^5.0.10",
  ```

- [ ] **Step 2: Add `packageManager` and `engines`** immediately after `"private": true,` (line 19),
  before `"dependencies"`:

  ```json
    "packageManager": "pnpm@11.8.0",
    "engines": {
      "node": "^22.0.0 || ^24.0.0"
    },
  ```

  (`^22.0.0 || ^24.0.0` matches what `@angular/build`/`@angular/cli` require and covers local Node
  24 and Travis Node 22.)

- [ ] **Step 3: Sanity-check the JSON** (no dependency resolution yet, npm is still the manager here):

  ```
  node -e "console.log(JSON.stringify(require('./package.json').packageManager))"
  ```
  Expected: `"pnpm@11.8.0"`

- [ ] **Step 4: Commit.**

  ```
  git add package.json
  git commit -m "chore: declare rimraf and @eslint/js devDependencies, pin packageManager to pnpm"
  ```

---

### Task 2 — Convert the lockfile and install with pnpm

**Files:** `.gitignore`, `pnpm-lock.yaml` (new), `package-lock.json` (deleted)

- [ ] **Step 1: Remove npm's node_modules.** npm's hoisted layout is exactly the thing pnpm's strict
  layout must prove itself against, so a pnpm install must start clean:

  ```
  Remove-Item -Recurse -Force node_modules
  ```
  Expected: no output. `package-lock.json` stays in place for now.

- [ ] **Step 2: Generate the lockfile from npm's, and install.**

  ```
  pnpm import
  pnpm install --frozen-lockfile
  ```
  Expected: `pnpm import` prints something like `pnpm-lock.yaml generated from package-lock.json`,
  then `pnpm install` finishes with `Packages: +1174`-style output **and one warning line**
  `Ignored build scripts: esbuild, …`. That warning is expected and handled in task 4 — do not add
  anything to `pnpm-workspace.yaml` yet. If `--frozen-lockfile` fails with "lockfile missing", check
  `pnpm import` succeeded before continuing.

- [ ] **Step 3: Verify no version drift** (the point of Approach A — pnpm must resolve the same
  versions npm had). Write the parity helper to
  `C:\Users\alexe\AppData\Local\Temp\opencode\pnpm-parity.cjs` with the `write` tool (not a shell
  heredoc):

  ```js
  const fs = require('node:fs');
  // PowerShell's Out-File -Encoding utf8 writes a BOM; strip it so JSON.parse works.
  const read = (path) => fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
  const [lockFile, pnpmFile] = process.argv.slice(2);
  const lock = JSON.parse(read(lockFile));
  const pnpm = JSON.parse(read(pnpmFile));

  const npmVersions = new Map();
  for (const [key, pkg] of Object.entries(lock.packages ?? {})) {
    if (!key.startsWith('node_modules/') || !pkg.version) continue;
    npmVersions.set(key.split('node_modules/').pop(), pkg.version);
  }

  const pnpmVersions = new Map();
  for (const pkg of Array.isArray(pnpm) ? pnpm : [pnpm]) {
    if (pkg.name && pkg.version) pnpmVersions.set(pkg.name, pkg.version);
  }

  let drift = 0;
  for (const [name, version] of [...npmVersions].sort()) {
    const other = pnpmVersions.get(name);
    if (other && other !== version) {
      console.log(`${name}: npm ${version} -> pnpm ${other}`);
      drift++;
    }
  }
  console.log(drift ? `DRIFT: ${drift} packages differ` : 'no version drift');
  ```

  `package-lock.json` is still on disk at this point, so compare it directly against what pnpm
  installed. PowerShell's plain `>` redirect writes UTF-16, so pipe through `Out-File -Encoding
  utf8`:

  ```
  pnpm ls --depth 0 --json | Out-File -Encoding utf8 "$env:TEMP\opencode\pnpm-versions.json"
  node "$env:TEMP\opencode\pnpm-parity.cjs" package-lock.json "$env:TEMP\opencode\pnpm-versions.json"
  ```
  Expected: `no version drift`. If it prints `DRIFT: n packages differ` with Angular/* versions
  rising from 19.0.x to 19.2.x, the import didn't preserve versions — **stop and report**, don't
  "fix" it with `pnpm dedup`.

- [ ] **Step 4: Run the verification suite**, plus the two things the strict layout could break
  (undeclared deps and deep `node_modules` paths):

  ```
  pnpm test
  pnpm lint
  pnpm run generate-chords-index
  ```
  Expected: 3 suites / 42 tests pass; `All files pass linting.`; `dd-chords.json` regenerated
  (`src/assets/dd-chords/dd-chords.json` exists and is gitignored).

- [ ] **Step 5: Drop npm's lockfile and ignore pnpm artifacts.**

  ```
  git rm package-lock.json
  ```
  Then append to `.gitignore`, after the existing `npm-debug.log` line (keep `npm-debug.log` itself):

  ```
  # pnpm
  pnpm-debug.log*
  .pnpm-store/
  ```

- [ ] **Step 6: Commit.**

  ```
  git add pnpm-lock.yaml .gitignore
  git commit -m "chore: import pnpm lockfile from npm, remove package-lock.json"
  ```

---

### Task 3 — Scripts: stop chaining through npm

**Files:** `package.json`

- [ ] **Step 1: Rewrite the script chain.** `npm run` inside a pnpm project works only by accident;
  make the chain pnpm-native and flatten the two `-- --watch` passthroughs into direct flags
  (behavior unchanged):

  ```json
    "prebuild": "rimraf dist && pnpm run generate-chords-index",
    "prebuild:dev": "pnpm run prebuild",
    "build:watch": "ng build --watch",
    "test:watch": "jest --updateSnapshot --bail --runInBand --watchAll",
  ```

  (`rimraf` resolves because task 1 declared it; the two `npm run … -- --watch` indents are gone.)

- [ ] **Step 2: Verify the scripts actually run.**

  ```
  pnpm run generate-chords-index
  pnpm test
  pnpm lint
  ```
  Expected: same green output as before. Then a full build (needs task 4's `allowBuilds`, so run it
  after task 4 if this fails on esbuild):

  ```
  pnpm build
  ```
  Expected: build succeeds and prints a `dd-chords-pwa` bundle summary with no errors. If it fails
  on esbuild ("You installed esbuild for another platform" / "Cannot find module …esbuild"), that is
  task 4's job — finish task 4 first, then re-run this.

- [ ] **Step 3: Commit.**

  ```
  git add package.json
  git commit -m "chore: run script chain through pnpm, flatten watch flags"
  ```

---

---

### Task 4 — `pnpm-workspace.yaml`: the security policy

**Files:** `pnpm-workspace.yaml` (new)

- [ ] **Step 1: Read the report pnpm gave you in task 2.** Its `Ignored build scripts:` line names
  exactly which packages want to run scripts. Decide per package — allow only what the app needs at
  runtime, block everything else. For this repo the expected entries are:

  | package | why | verdict |
  | --- | --- | --- |
  | `esbuild` | `@angular-devkit/build-angular` needs its binary to build | `true` |
  | `@parcel/watcher` | dev-time file-watching native binding | `true` |
  | `lmdb` | Angular cache backend (native binding) | `true` |
  | `msgpackr-extract` | serialization native binding (lmdb peer) | `true` |
  | `fsevents` | macOS-only watcher; no-op on Linux/Windows CI | `true` |

  Anything else in that report is blocked by leaving it out — note it in the commit message if it
  looks app-relevant (e.g. a package whose build output the app imports).

- [ ] **Step 2: Write the file.** Exact content (pnpm 11 reads project settings here, not `.npmrc`;
  no machine-level keys — those are ignored in this file):

  ```yaml
  # pnpm project settings (pnpm 11+). Machine-level settings (store dir, etc.) are ignored here.
  # Install/postinstall scripts are blocked unless listed; strictDepBuilds (default true) aborts
  # installs that need an unlisted package's build.
  allowBuilds:
    esbuild: true
    '@parcel/watcher': true
    lmdb: true
    msgpackr-extract: true
    fsevents: true
  engineStrict: true
  strictPeerDependencies: true
  ```

  No `packages:` key — this is a single-package project, and pnpm treats the file as settings only.

- [ ] **Step 3: Reinstall so the allowed scripts run, and confirm the ignored list is now empty.**

  ```
  pnpm install --frozen-lockfile
  ```
  Expected: no `Ignored build scripts:` warning. Then:

  ```
  pnpm rebuild esbuild
  node_modules\.bin\esbuild --version
  ```
  Expected: a version string like `0.21.x` (or whatever `@angular-devkit/build-angular` pins). If
  esbuild still can't run, the allow-list entry didn't take effect — fix before continuing.

- [ ] **Step 4: Full verification, including the production build.**

  ```
  pnpm test
  pnpm lint
  pnpm build
  ```
  Expected: tests green, `All files pass linting.`, build succeeds. If `strictPeerDependencies`
  aborts the install with a peer error (e.g. `@angular/animations` requiring `@angular/core@19.0.6`),
  **stop and report the exact message** — resolving it needs a decision (override pin or loosen the
  setting), and that belongs in the spec, not a workaround.

- [ ] **Step 5: Commit.**

  ```
  git add pnpm-workspace.yaml
  git commit -m "chore: allow only the five native builds, strict engines and peer deps"
  ```

---

### Task 5 — Travis: pnpm + corepack + a cached store

**Files:** `.travis.yml`

- [ ] **Step 1: Rewrite the file.** Exact content:

  ```yaml
  sudo: false

  language: node_js
  node_js:
    - 22

  branches:
    only:
      - main

  cache:
    directories:
      - $HOME/.cache/pnpm
      - $HOME/.local/share/pnpm/store

  before_install:
    - corepack enable
    - corepack prepare pnpm@11.8.0 --activate

  before_script:
    - npm install -g firebase-tools

  script:
    - pnpm install --frozen-lockfile
    - pnpm test
    - pnpm build

  after_success:
    - firebase deploy --token "$FIREBASE_TOKEN"
  ```

  Notes: `firebase-tools` stays a global npm install on purpose (its `re2` install-script chain never
  enters the app tree, so it needs no `allowBuilds` entry), and `firebase deploy` stays npm-based —
  both are CI-only. The old global `@angular/cli` install is dropped: `@angular/cli` is already a
  devDependency and `pnpm build` uses the local binary.

- [ ] **Step 2: Validate the YAML locally** (Travis itself can't be run here):

  ```
  node -e "console.log(require('fs').readFileSync('.travis.yml','utf8').split('\n').filter(l=>l.trim()).length)"
  ```
  Expected: a number ≥ 20, and no tabs in the file:

  ```
  Select-String -Pattern "`t" -Path .travis.yml
  ```
  Expected: no matches.

- [ ] **Step 3: Commit.**

  ```
  git add .travis.yml
  git commit -m "ci: activate pnpm via corepack, frozen lockfile, cached store"
  ```

---

### Task 6 — Docs and ledger

**Files:** `README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/LEDGER.md`

- [ ] **Step 1: Find every npm command reference.**

  ```
  Select-String -Pattern "npm (run |ci |i |test|install)" -Path README.md,AGENTS.md,docs/*.md | Select-Object -First 30
  ```
  Expected: hits in README (`npm test`, `npm run test && npm run build`, `npm install -g
  firebase-tools`, `npm install`, `npm start`), AGENTS (the command block + the `.travis.yml` line),
  `docs/ARCHITECTURE.md` (the install line), `docs/LEDGER.md` (none expected).

- [ ] **Step 2: Rewrite each hit to its pnpm equivalent**, keeping the surrounding prose intact:
  - `npm install` → `pnpm install`; `npm ci` → `pnpm install --frozen-lockfile`
  - `npm test` → `pnpm test`; `npm run <x>` → `pnpm <x>` (scripts) / `pnpm run <x>`
  - `npm start` → `pnpm start`; `npm run lint` → `pnpm lint`; `npm run build` → `pnpm build`
  - `npm install -g firebase-tools` **stays npm** (CI-only global install, per task 5).
  In README, add one line after the install instruction: "pnpm is pinned by `packageManager` in
  `package.json`; `corepack enable` makes it available."

- [ ] **Step 3: Update AGENTS.md's "Commands" block** to the pnpm equivalents, and add one landmine
  line under section 4:

  ```
  - **pnpm's strict layout.** No hoisting: an undeclared import is a build error, not a warning.
    `pnpm-workspace.yaml` `allowBuilds` is the install-script allow-list; anything else is blocked.
  ```

- [ ] **Step 4: `docs/LEDGER.md`** — add goal `G4: migrate npm → pnpm (branch: pnpm-migration)`, and
  under `Milestones` a line: `pnpm migration: design + plan committed; branch pnpm-migration at
  <short SHA>` (use the real HEAD sha). Refresh `Last updated` / `Branch` / `HEAD` / clean-tree
  flags. Do not touch M1/M2/M3.

- [ ] **Step 5: Confirm nothing npm-ish is left** in the docs (besides the deliberate
  `firebase-tools`/`npm audit` mentions):

  ```
  Select-String -Pattern "npm run|npm ci|npm install(?! -g)" -Path README.md,AGENTS.md,docs/*.md
  ```
  Expected: only the `firebase-tools` global install line.

- [ ] **Step 6: Commit.**

  ```
  git add README.md AGENTS.md docs/ARCHITECTURE.md docs/LEDGER.md docs/superpowers
  git commit -m "docs: pnpm commands, strict-layout landmine, ledger goal"
  ```

  (This also commits `docs/superpowers/` spec + plan from this session.)

---

### Task 7 — Cold-install acceptance and report

- [ ] **Step 1: Cold install from scratch**, the way a fresh clone would:

  ```
  Remove-Item -Recurse -Force node_modules
  pnpm install --frozen-lockfile
  pnpm test
  pnpm lint
  pnpm build
  ```
  Expected: install without warnings about ignored scripts; 3 suites / 42 tests / 1 snapshot;
  `All files pass linting.`; production build succeeds.

- [ ] **Step 2: Confirm the repo state:**

  ```
  git status --short
  git log --oneline main..pnpm-migration
  ```
  Expected: clean tree (only untracked/ignored `node_modules`, `dist`, `src/assets/dd-chords/dd-chords.json`
  stay invisible), and six commits on `pnpm-migration` ahead of `main`.

- [ ] **Step 3: Report to the user:** the install-script allow-list that shipped, any peer warnings
  `strictPeerDependencies` surfaced, disk/store savings, and the two open questions from the spec
  (`https` devDependency, the 90 npm audit findings). Do not merge or push.

