## Overview

Renovate configuration generator. Produces a `default.json` preset file consumed by Renovate Bot instances across all GitLab repositories. TypeScript source in `src/` defines package rules per manager (node, go, helm, kustomize, terraform, argocd, etc.) which are compiled and validated via `pnpm start`.

## Stack & Structure

- **Language:** TypeScript (ESM)
- **Framework:** oclif CLI (`@cenk1cenk2/oclif-common`)
- **Build:** `tsdown` (`pnpm build`), run with `pnpm start` to generate `default.json`
- **Package Manager:** pnpm
- **Key directories:**
  - `src/constants/` — schedules, scope, users, `Labels` enum. Cross-cutting only: a custom manager's `depType` name stays next to the custom manager that emits it, not here.
  - `src/lib/` — `createPreset()`, `createScopes()` and `createMultiDirectoryGroupRule()` factories
  - `test/` — invariant tests over the assembled presets (`pnpm test`)
  - `src/presets/index.ts` — `Preset` enum, `PRESETS` record, `FILES` output mapping
  - `src/presets/managers/<name>/` — per-manager assemblers (`manager.ts`, `custom-manager.ts`). `src/presets/managers/index.ts` holds the `Managers` enum.
  - `src/presets/groups/<name>/` — group presets. `src/presets/groups/index.ts` holds the `Groups` enum (groupSlug values).
  - `src/presets/rings/<name>/` — ring presets (node, go). `src/presets/rings/index.ts` holds the `Rings` enum.
  - `src/presets/datasources/<name>/` — datasource presets. `src/presets/datasources/index.ts` holds the `Datasources` enum.
  - `src/types/` — ambient module decls for untyped renovate submodules + `PackageRule` augmentation.
  - `src/commands/` — oclif command; iterates `FILES` to assemble and validate each output file.
- **Path aliases:** `@constants`, `@lib`, `@presets`, `@presets/*`, `@managers`, `@groups`, `@rings`, `@datasources`.

## Conventions

- Each manager has a `manager.ts` that enables the manager and composes group presets via `createScopes()`
- Group files define `packageRules` arrays — typically a catch-all rule (`automerge: false`) followed by specific automerge rules matching `matchSourceUrls` + `matchPackageNames`
- Minor/patch updates use `extends: [':semanticCommitTypeAll(feat)']`, major updates use `perf`
- **Labels are additive — see the Labels section below.** `base.ts` holds the only `labels:` in the repo; everything else uses `addLabels`. Values always come from the `Labels` enum (`@constants`), never raw strings.
- `groupSlug` values come from the `Groups` enum (`@groups`). `Rings` enum (`@rings`) provides ring group slugs, which are **manager-qualified** (`node-fast-ring`, `go-fast-ring`) because renovate derives the branch name from the slug — a shared slug merges go and node updates of a polyglot repo into one MR.
- The `Preset` enum in `src/presets/index.ts` uses category prefixes: **real presets** (`default`, `base`, `lock-file`, `no-tests`, `branch-*`) no prefix; **managers** `manager-*`; **groups** `group-*`; **rings** `ring-*`; **datasources** `datasource-*`. New files must be registered in both the enum and the `PRESETS` record.
- `SCOPE` prefix (`local>renovate/renovate-config:default/`) is prepended to all preset references via `createScopes(Preset.X, ...)`.
- Conventional commits: `feat` for features, `fix` for fixes, `build(deps)` for dependency updates
- **Object spreads go first, explicit keys after** — `{ ...NODE_GROUP_DEV, groupName, groupSlug, schedule }`. A shared constant must never be able to silently clobber a local key.
- **Field patterns** — two shapes:
  - **Pattern M** (multi-directory: argocd, helm, kustomize, terraform): produced by `createMultiDirectoryGroupRule()` from `@lib`, which derives `additionalBranchPrefix: '{{packageFileDir}}-'`, `commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]'`, the `groupName`, the semantic commit type and the automerge label. Do not hand-write these rules — pass `name` / `updateType` / `slug` / `managers` and the optional matchers to the factory. `schedule` lives on the manager preset's own `matchManagers` rule.
  - **Pattern S** (single-directory: node, go, gitlab-ci, ansible-galaxy, otel-builder, docker-datasource): no `additionalBranchPrefix`, no `commitMessageExtra`; per-rule `schedule`.
- **Never put `schedule` at the top level of a preset.** Top-level fields are non-mergeable and apply globally to the assembled config — the last extended preset that sets one wins for every dependency. Scope it to a `packageRules` entry instead.

## Automerge Pattern

Every manager that supports automerge follows the same two-rule pattern in its group files:

1. **Catch-all rule** — matches all packages for the manager/update-type, `automerge: false`
2. **Automerge rule** — matches specific packages via `matchSourceUrls` and/or `matchPackageNames`, `automerge: true`. For Pattern M the factory attaches `Labels.AUTOMERGE` automatically whenever `automerge: true`; Pattern S rules add it by hand.

To enable automerge for a new package, add its source URL to `matchSourceUrls` and package name to `matchPackageNames` in the automerge rule of both the minor and major group files for the relevant manager.

**Managers with automerge rules:**

- `kustomize` — `groups/kustomize/minor-helm-releases.ts`, `groups/kustomize/major.ts` (matches `HelmChart` dep type)
- `helm` — `groups/helm/minor.ts`, `groups/helm/major.ts`
- `argocd` — `groups/argocd/minor.ts`, `groups/argocd/major.ts` (matches git URLs as package names)

## Labels

Labels compose **additively** across six namespaced axes plus two flat values. Every axis is contributed by the layer that owns it, so a rule only ever declares what it itself adds.

| Axis       | Owner                                                | Values                                                                    |
| ---------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| umbrella   | `base.ts` `labels:` — the only `labels:` in the repo | `renovate`                                                                |
| update     | two `matchUpdateTypes` rules in `base.ts`            | `update:minor`, `update:major`                                            |
| manager    | the manager preset's `matchManagers` rule            | `manager:helm`, `manager:node`, …                                         |
| area       | the same manager rule                                | `area:infrastructure`, `area:pipelines`                                   |
| dep        | the node group constants, `lock-file.ts`             | `dep:dev`, `dep:build`, `dep:docs`, `dep:peer`, `dep:engines`, `dep:lock` |
| datasource | the datasource preset's `matchDatasources` rule      | `datasource:docker`                                                       |
| ring       | the ring preset's identity rule                      | `ring:fast`, `ring:slow`                                                  |
| flag       | automerge rules                                      | `automerge`                                                               |

Mechanics, verified against the installed renovate source — **do not re-derive**:

- `labels` is **non-mergeable**: each matching packageRule overwrites the previous value entirely, last match wins (`dist/config/options/index.js`, `dist/config/utils.js`).
- `addLabels` is `mergeable: true`: it concatenates across the top-level config **and** every matching packageRule.
- The final PR label set is `[...new Set([...labels, ...addLabels])].sort()` (`dist/workers/repository/update/pr/labels.js`) — deduped and alphabetically sorted, so declaration order never affects output.
- Renovate's own docs recommend `addLabels` over `labels` in shareable presets for exactly this reason.

`update:*` deliberately does not cover `rollback` — `rollbackPrs` defaults to `false` and this config never enables it. `lockFileMaintenance` is not a matchable update type; it carries `dep:lock` from `lock-file.ts`. `rings/node/none.ts` gets no ring label because every rule in it is `enabled: false`.

Adding a manager means adding its `manager:<name>` label and wiring the identity rule — `test/presets.test.ts` fails if you forget.

## Renovate Documentation References

When modifying or creating package rules, always consult the official Renovate docs:

- **packageRules:** https://docs.renovatebot.com/configuration-options/#packagerules — the core mechanism this repo uses. Rules are evaluated **in order** and **all matching rules are applied** (not just the first match). Later rules override earlier ones for the same field, so **order matters**: place broad catch-all rules first, then specific overrides (like automerge) after. This is why each group file has the catch-all `automerge: false` rule before the specific `automerge: true` rule.
- **matchSourceUrls:** https://docs.renovatebot.com/configuration-options/#matchsourceurls — matches the upstream source repository URL of a dependency.
- **matchPackageNames:** https://docs.renovatebot.com/configuration-options/#matchpackagenames — supports exact names, globs, and regex. In this repo we use exact names.
- **matchManagers:** https://docs.renovatebot.com/configuration-options/#matchmanagers — scopes a rule to specific package managers (e.g., `kustomize`, `helmv3`, `argocd`).
- **matchUpdateTypes:** https://docs.renovatebot.com/configuration-options/#matchupdatetypes — `major`, `minor`, `patch`, `pin`, `digest`, etc.
- **matchDepTypes:** https://docs.renovatebot.com/configuration-options/#matchdeptypes — e.g., `HelmChart` for kustomize helm chart dependencies.
- **automerge:** https://docs.renovatebot.com/configuration-options/#automerge — when `true`, Renovate auto-merges the MR if pipeline passes.
- **groupName / groupSlug:** https://docs.renovatebot.com/configuration-options/#groupname — groups multiple updates into a single MR.
- **schedule presets:** https://docs.renovatebot.com/presets-schedule/ — predefined schedule expressions used in `src/constants/renovate.ts`.

**Key rule:** `packageRules` are additive and last-match-wins per field. A package can match multiple rules — each matching rule's fields are merged, with later rules taking precedence. This is the foundation of the catch-all + specific-override pattern used throughout this repo.

## Building & Validating

```bash
pnpm build      # compile TypeScript
pnpm typecheck  # tsc --noEmit over src/ and test/
pnpm lint       # eslint ./src
pnpm test       # invariant tests over the assembled presets
pnpm start      # generate default.json + validate with renovate's built-in validator
```

After any change run `pnpm start` and verify `default.json` includes the expected rules. `default.json` is **committed** — CI regenerates it and fails on `git diff --exit-code`, so a stale file breaks the pipeline. Validation errors are fatal: `pnpm start` reports every error across every preset, then exits non-zero.

## Gotchas

- **`lib` is pinned to `es2024`** in `tsconfig.json` because `@typescript-eslint/scope-manager@8.57.0` doesn't recognize `es2025.iterator` (which TS 6 resolves `ESNext.Iterator` to). Unpinning will break `pnpm lint`.
- **`PackageRule` is augmented** in `src/types/renovate-augment.d.ts` because renovate 43.139 removed `additionalBranchPrefix` and `commitMessageSuffix` from its public `PackageRule` type even though both still work at runtime. Do not remove the augmentation.
- **`renovate/dist/config/migration.js` and `validation.js` have no shipped types** — ambient declarations live in `src/types/renovate-modules.d.ts`.
- **`default.json` is prettier-ignored.** It is generated, and prettier's formatting disagrees with the generator's. Without the ignore entry the `lint-staged` pre-commit hook rewrites the file on every commit and the CI freshness gate then fails on every pipeline.
- **`lint` is ESLint-only** (`eslint ./src`), not tsc. Type errors do not fail lint — `pnpm typecheck` is a separate script and a separate CI job.
- **`createPreset()` takes exactly `RenovateConfig`**, which is what makes excess-property checking catch misspelled renovate fields. Do not widen it back to `RenovateConfig & Record<PropertyKey, any>` — that silently disables the check for every preset.
- **Kubernetes per-manager config** (`[Managers.KUBERNETES]: {...}` in `managers/kubernetes/manager.ts`) is cast with `as RenovateConfig` — the shape is valid at runtime but absent from the public type. This is the only cast in `src/`; if another preset needs one, prefer fixing the type augmentation.
