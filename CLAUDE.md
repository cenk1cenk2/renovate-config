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
  - **Pattern M** (multi-directory: argocd, helm, kustomize, terraform): produced by `createMultiDirectoryGroupRule()` from `@lib`, which derives `additionalBranchPrefix: '{{packageFileDir}}-'`, `commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]'`, the `groupName` and the automerge label. `matchUpdateTypes` and the commit type are **passed in by the call site** — `matchUpdateTypes` as the renovate field, the commit type as `commitType` (which the factory wraps into `extends: [':semanticCommitTypeAll(<commitType>)']`) — so the factory bakes in no update-type set. The `groupName` update word (`minor`/`major`) is derived from whether `matchUpdateTypes` includes `major`. The factory deliberately emits no `enabled: true` — `enabled` is last-match-wins, so a default would silently re-enable dependencies an earlier, more specific rule disabled. Do not hand-write these rules — pass `name`, `matchUpdateTypes` and `commitType`; everything else is an ordinary `PackageRule` spread straight through, so call sites use renovate's own field names (`matchManagers`, `matchDepTypes`, `groupSlug`) and can override any derived field by passing it. `schedule` lives on the manager preset's own `matchManagers` rule.
  - **Pattern S** (single-directory: node, go, gitlab-ci, ansible-galaxy, otel-builder, docker-datasource): no `additionalBranchPrefix`, no `commitMessageExtra`; per-rule `schedule`.
- **Never put `schedule` at the top level of a preset.** Top-level fields are non-mergeable and apply globally to the assembled config — the last extended preset that sets one wins for every dependency. Scope it to a `packageRules` entry instead.

## Automerge Pattern

**A breaking update never automerges.** No rule may set `automerge: true` while matching `major` or `replacement`, and no automerge rule may omit `matchUpdateTypes` — an unbounded rule catches majors too. The major group presets therefore have no automerge twin. `lockFileMaintenance` is the one exemption: it is its own update type and carries no version bump. `test/presets.test.ts` enforces both rules.

Note that renovate rejects any rule setting `matchUpdateTypes` together with one of its 15 `preLookupOptions` — `rangeStrategy`, `versioning`, `registryUrls`, `allowedVersions`, `separateMajorMinor` and the rest — because those are resolved before the update type is known. Bounding an automerge rule by update type therefore means moving its `rangeStrategy` into a separate rule, as the node dependency, devDependency, peer and package-manager groups all do.

Every manager that supports automerge follows the same two-rule pattern in its group files:

1. **Catch-all rule** — matches all packages for the manager/update-type, `automerge: false`
2. **Automerge rule** — matches specific packages via `matchSourceUrls` and/or `matchPackageNames`, `automerge: true`. For Pattern M the factory attaches `Labels.AUTOMERGE` automatically whenever `automerge: true`; Pattern S rules add it by hand.

To enable automerge for a new package, add its source URL to `matchSourceUrls` and package name to `matchPackageNames` in the automerge rule of the **minor** group file for the relevant manager. There is no major equivalent, by policy.

**Managers with automerge rules:**

- `kustomize` — `groups/kustomize/minor-helm-releases.ts`, `groups/kustomize/major.ts` (matches `HelmChart` dep type)
- `helm` — `groups/helm/minor.ts`, `groups/helm/major.ts`
- `argocd` — `groups/argocd/minor.ts`, `groups/argocd/major.ts` (matches git URLs as package names)

## Labels

Labels compose **additively** across six namespaced axes plus two flat values. Every axis is contributed by the layer that owns it, so a rule only ever declares what it itself adds.

| Axis       | Owner                                                | Values                                                                            |
| ---------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| umbrella   | `base.ts` `labels:` — the only `labels:` in the repo | `renovate`                                                                        |
| update     | two `matchUpdateTypes` rules in `base.ts`            | `update:minor`, `update:major`                                                    |
| manager    | the manager preset's `matchManagers` rule            | `manager:helm`, `manager:node`, …                                                 |
| area       | the same manager rule                                | `area:infrastructure`, `area:pipelines`                                           |
| dep        | the node group constants, `lock-file.ts`             | `dep:dev`, `dep:build`, `dep:docs`, `dep:peer`, `dep:package-manager`, `dep:lock` |
| datasource | the datasource preset's `matchDatasources` rule      | `datasource:docker`                                                               |
| ring       | the ring preset's identity rule                      | `ring:fast`, `ring:slow`                                                          |
| flag       | automerge rules                                      | `automerge`                                                                       |

### One axis, one owner

`addLabels` is **append-only and irreversible**. There is no `removeLabels` config option, no negation syntax for label values, and setting `labels` in a later rule does not suppress labels already accumulated by `addLabels` — `prepareLabels` simply unions the two (`dist/workers/repository/update/pr/labels.js:15-19`).

So the catch-all-then-override pattern that works everywhere else in this repo **does not work for labels**. A broad rule that adds `area:infrastructure` followed by a narrow rule adding `area:application` yields a dependency carrying both, permanently.

Therefore every `addLabels` axis must be **exactly scoped up front**, and exactly one kind of rule may contribute a given axis:

- `manager:*` and `area:*` — owned by the manager identity rule. The manager is what determines the area.
  - `area:infrastructure` — argocd, helm, kubernetes, kustomize, terraform, ansible-galaxy, otel-builder.
  - `area:pipelines` — gitlab-ci.
  - **No area** — node, go, python, rust (application by absence) and dockerfile, which cannot tell an application image from an infrastructure one. Adding an area later is always possible; removing a wrong one is not, so an undetermined manager asserts nothing.
- `datasource:*` — owned by the datasource identity rule, which must **never** add an area: 36 managers emit docker deps alone, spanning pipelines and infrastructure.
- `dep:*` — owned by the dep-type group constants.
- `ring:*` — owned by the ring identity rule.

`test/presets.test.ts` enforces this ownership.

If an axis ever does need exceptions, carve them out in the broad rule rather than overriding afterwards. All six matchers (`matchPackageNames`, `matchDepTypes`, `matchManagers`, `matchDatasources`, `matchFileNames`, `matchRepositories`) accept `!`-prefixed globs and regexes via `matchRegexOrGlobList` (`dist/util/string-match.js:17-28`); a list of only negatives means "everything except". `matchFileNames` matches the dependency's `packageFile` path (and its `lockFiles`), which is the way to tell a docker image in a `Dockerfile` from one in a helm values file.

**Overlapping matchers stack labels.** Two rules can each be well-formed and still put two values of one axis on the same dependency. The node `dep:` groups are where this actually bites: the dev group is the catch-all for `devDependencies`, so it negates every package the build, docs and package-manager groups claim (`NODE_DEV_PACKAGES` in `groups/node/groups.ts`). Add a package to one of those lists and the catch-all excludes it automatically.

Mechanics, verified against the installed renovate source — **do not re-derive**:

- `labels` is **non-mergeable**: each matching packageRule overwrites the previous value entirely, last match wins (`dist/config/options/index.js`, `dist/config/utils.js`).
- `addLabels` is `mergeable: true`: it concatenates across the top-level config **and** every matching packageRule.
- The final PR label set is `[...new Set([...labels, ...addLabels])].sort()` (`dist/workers/repository/update/pr/labels.js`) — deduped and alphabetically sorted, so declaration order never affects output.
- The docs state the mergeability contrast between `labels` and `addLabels`; the "use `addLabels` in shareable presets" conclusion is ours, drawn from it.
- The options used here that are `mergeable: true` are `addLabels`, `packageRules`, `customManagers`, `lockFileMaintenance`, `ignoreDeps`, `postUpdateOptions` and the `match*` list matchers. Note `lockFileMaintenance` merging means `lock-file.ts` composes with `config:recommended`'s block rather than replacing it. Everything else is last-match-wins, including `automerge`, `enabled`, `groupName`, `groupSlug`, `rangeStrategy`, `semanticCommitType`, `minimumReleaseAge` and the `commitMessage*` family — those are safe to broad-then-override.
- `schedule` is an array but **not** mergeable, so a per-rule `schedule` silently discards a hoisted one instead of adding to it.
- `packageRules` order across presets is positional: `P1 → P2 → P3 → the extending config's own rules`. Preset identity does not matter, only position in `extends`.

`update:*` deliberately does not cover `rollback` — `rollbackPrs` defaults to `false` and this config never enables it. `lockFileMaintenance` is not a matchable update type; it carries `dep:lock` from `lock-file.ts`. `rings/node/none.ts` gets no ring label because every rule in it is `enabled: false`.

Every manager, datasource and ring preset carries an **identity rule** — a `matchManagers` / `matchDatasources` / package-set rule whose only job is `addLabels`. Keep identity separate from behaviour: never hang the identity label off a group rule, or it stops applying to updates that rule does not match.

Manager and datasource identity rules also re-add `Labels.RENOVATE`. Each preset ships as its own key in `default.json`, so a repository can extend `default/manager-helm` without `base` — without the umbrella there it would get no labels at all. The duplicate is free because renovate dedupes the final set.

Adding a manager means adding its `manager:<name>` label, wiring the identity rule and including the umbrella. `test/presets.test.ts` catches a missing umbrella and an orphaned label, but its manager table is opt-in — add the new manager to it, or that manager is unchecked.

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
- **`createPreset()` takes `Omit<RenovateConfig, 'schedule'>`** — one factory for every preset, `base.ts` included. Excess-property checking catches misspelled renovate fields and keeps the non-mergeable `schedule` off a preset's top level. `labels` stays allowed because `base.ts` owns the umbrella label; `test/presets.test.ts` (`declares labels only in the base preset`) is what enforces that no other preset sets it. Do not widen the parameter to `RenovateConfig & Record<PropertyKey, any>` — that silently disables the check for every preset.
- **Kubernetes per-manager config** (`[Managers.KUBERNETES]: {...}` in `managers/kubernetes/manager.ts`) is cast with `as RenovateConfig` — the shape is valid at runtime but absent from the public type. This is the only cast in `src/`; if another preset needs one, prefer fixing the type augmentation.
