## Overview

Renovate configuration generator. Produces a `default.json` preset file consumed by Renovate Bot instances across all GitLab repositories. TypeScript source in `src/` defines package rules per manager (node, go, helm, kustomize, terraform, argocd, etc.) which are compiled and validated via `pnpm start`.

## Stack & Structure

- **Language:** TypeScript (ESM)
- **Framework:** oclif CLI (`@cenk1cenk2/oclif-common`)
- **Build:** `tsdown` (`pnpm build`), run with `pnpm start` to generate `default.json`
- **Package Manager:** pnpm
- **Key directories:**
  - `src/constants/` — enums for managers, schedules, rings, datasources
  - `src/lib/` — `createPreset()` and `createScopes()` factories
  - `src/presets/` — all preset definitions
  - `src/presets/managers/<manager>/` — per-manager config (manager.ts + group files)
  - `src/commands/` — oclif command that assembles and validates all presets

## Conventions

- Each manager has a `manager.ts` that enables the manager and composes group presets via `createScopes()`
- Group files define `packageRules` arrays — typically a catch-all rule (`automerge: false`) followed by specific automerge rules matching `matchSourceUrls` + `matchPackageNames`
- Minor/patch updates use `extends: [':semanticCommitTypeAll(feat)']`, major updates use `perf`
- Automerge rules add the `automerge` label alongside other labels
- The `Preset` enum in `src/presets/index.ts` maps preset names to lazy imports — new group files must be registered here
- `SCOPE` prefix (`local>renovate/renovate-config:default/`) is prepended to all preset references
- Conventional commits: `feat` for features, `fix` for fixes, `build(deps)` for dependency updates

## Automerge Pattern

Every manager that supports automerge follows the same two-rule pattern in its group files:

1. **Catch-all rule** — matches all packages for the manager/update-type, `automerge: false`
2. **Automerge rule** — matches specific packages via `matchSourceUrls` and/or `matchPackageNames`, `automerge: true`, adds `automerge` label

To enable automerge for a new package, add its source URL to `matchSourceUrls` and package name to `matchPackageNames` in the automerge rule of both the minor and major group files for the relevant manager.

**Managers with automerge rules:**

- `kustomize` — `group-minor-helm-releases.ts`, `group-major.ts` (matches `HelmChart` dep type)
- `helm` — `group-minor.ts`, `group-major.ts`
- `argocd` — `group-minor.ts`, `group-major.ts` (matches git URLs as package names)

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
