## Overview

Renovate configuration generator. Produces a `default.json` preset file consumed by Renovate Bot instances across all GitLab repositories. TypeScript source in `src/` defines package rules per manager (node, go, helm, kustomize, terraform, argocd, etc.) which are compiled and validated via `pnpm start`.

## Stack & Structure

- **Language:** TypeScript (ESM)
- **Framework:** oclif CLI (`@cenk1cenk2/oclif-common`)
- **Build:** `tsdown` (`pnpm build`), run with `pnpm start` to generate `default.json`
- **Package Manager:** pnpm
- **Key directories:**
  - `src/constants/` — schedules, scope, users, `Labels` enum
  - `src/lib/` — `createPreset()` and `createScopes()` factories
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
- Labels come from the `Labels` enum (`@constants`). Do not use raw strings — `labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE]` etc. Automerge rules add `Labels.AUTOMERGE`.
- `groupSlug` values come from the `Groups` enum (`@groups`). `Rings` enum (`@rings`) provides ring group slugs.
- The `Preset` enum in `src/presets/index.ts` uses category prefixes: **real presets** (`default`, `base`, `lock-file`, `no-tests`, `branch-*`) no prefix; **managers** `manager-*`; **groups** `group-*`; **rings** `ring-*`; **datasources** `datasource-*`. New files must be registered in both the enum and the `PRESETS` record.
- `SCOPE` prefix (`local>renovate/renovate-config:default/`) is prepended to all preset references via `createScopes(Preset.X, ...)`.
- Conventional commits: `feat` for features, `fix` for fixes, `build(deps)` for dependency updates
- **Field patterns** — two shapes:
  - **Pattern M** (multi-directory: argocd, helm, kustomize, terraform): group rules carry `additionalBranchPrefix: '{{packageFileDir}}-'`, generic `groupName` (no `{{packageFileDir}}`), `commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]'`. `schedule` is hoisted to the manager preset.
  - **Pattern S** (single-directory: node, go, gitlab-ci, ansible-galaxy, otel-builder, docker-datasource): no `additionalBranchPrefix`, no `commitMessageExtra`; per-rule `schedule`.

## Automerge Pattern

Every manager that supports automerge follows the same two-rule pattern in its group files:

1. **Catch-all rule** — matches all packages for the manager/update-type, `automerge: false`
2. **Automerge rule** — matches specific packages via `matchSourceUrls` and/or `matchPackageNames`, `automerge: true`, adds `automerge` label

To enable automerge for a new package, add its source URL to `matchSourceUrls` and package name to `matchPackageNames` in the automerge rule of both the minor and major group files for the relevant manager.

**Managers with automerge rules:**

- `kustomize` — `groups/kustomize/minor-helm-releases.ts`, `groups/kustomize/major.ts` (matches `HelmChart` dep type)
- `helm` — `groups/helm/minor.ts`, `groups/helm/major.ts`
- `argocd` — `groups/argocd/minor.ts`, `groups/argocd/major.ts` (matches git URLs as package names)

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
pnpm build     # compile TypeScript
pnpm start     # generate default.json + validate with renovate's built-in validator
```

After any change, run `pnpm start` and verify `default.json` includes the expected rules.

## Gotchas

- **`lib` is pinned to `es2024`** in `tsconfig.json` because `@typescript-eslint/scope-manager@8.57.0` doesn't recognize `es2025.iterator` (which TS 6 resolves `ESNext.Iterator` to). Unpinning will break `pnpm lint`.
- **`PackageRule` is augmented** in `src/types/renovate-augment.d.ts` because renovate 43.139 removed `additionalBranchPrefix` and `commitMessageSuffix` from its public `PackageRule` type even though both still work at runtime. Do not remove the augmentation.
- **`renovate/dist/config/migration.js` and `validation.js` have no shipped types** — ambient declarations live in `src/types/renovate-modules.d.ts`.
- **`lint` is ESLint-only** (`eslint ./src`), not tsc. Type errors do not fail lint. Run `pnpm exec tsc --noEmit` to catch them.
- **Kubernetes per-manager config** (`[Managers.KUBERNETES]: {...}` in `managers/kubernetes/manager.ts`) is cast with `as RenovateConfig` — this shape is valid at runtime but not in the public type.
