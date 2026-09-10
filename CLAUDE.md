## Overview

Renovate configuration generator. Produces a `default.json` preset file consumed by Renovate Bot instances across all GitLab repositories. TypeScript source in `src/` defines package rules per manager (node, go, helm, kustomize, terraform, argocd, etc.) which are compiled and validated via `pnpm start`.

## Stack & Structure

- **Language:** TypeScript (ESM)
- **Framework:** oclif CLI (`@cenk1cenk2/oclif-common`)
- **Build:** `tsdown` (`pnpm build`), run with `pnpm start` to generate `default.json`
- **Package Manager:** pnpm
- **Key directories:**
  - `src/constants/` — schedules, scope, users, `Labels` enum. Cross-cutting only: a custom manager's `depType` name stays next to the custom manager that emits it, not here.
  - `src/lib/` — `createPreset()`, `createScopes()`, `createMultiDirectoryGroupRule()`, the `createBreakingMajorRule()` / `createNoBreakingMajorRule()` pair, and `createNoAutomergeRule()`
  - `test/` — invariant tests over the assembled presets (`pnpm test`)
  - `src/presets/index.ts` — `Preset` enum, `PRESETS` record, `FILES` output mapping
  - `src/presets/managers/<name>/` — per-manager assemblers (`manager.ts`, `custom-manager.ts`). `src/presets/managers/index.ts` holds the `Managers` enum.
  - `src/presets/<managers|datasources>/<name>/overrides/` — **every parameterized preset lives here and nothing else does.** These are the consumer entrypoints: a repository extends one for itself, after `default/default`, to overrule what the estate-wide config decided. Six per manager — `automerge-{minor,major}`, `no-automerge-{minor,major}`, `breaking-major`, `no-breaking-major` — plus a `custom-` twin of each where the manager has a `custom.regex` variant. The directory name is the same word as the `renovate:override` label they all carry and the `PARAMETERIZED_PRESETS` list in the tests, so the concept has one name everywhere. Nothing outside `overrides/` may be parameterized, and nothing inside it may be reachable from `default`.
  - `src/presets/groups/<name>/` — group presets, one directory per manager (node, go, python, gitlab-ci, ansible-galaxy, helm, kustomize, terraform, argocd). `src/presets/groups/index.ts` holds the `Groups` enum (groupSlug values).
  - `src/presets/rings/<name>/` — ring presets (node, go). `src/presets/rings/index.ts` holds the `Rings` enum.
  - `src/presets/datasources/<name>/` — datasource presets. `src/presets/datasources/index.ts` holds the `Datasources` enum.
  - `src/types/` — ambient module decls for untyped renovate submodules + `PackageRule` augmentation.
  - `src/commands/` — oclif command; iterates `FILES` to assemble and validate each output file.
- **Path aliases:** `@constants`, `@lib`, `@presets`, `@presets/*`, `@managers`, `@groups`, `@rings`, `@datasources`.

## Conventions

- Each manager has a `manager.ts` that enables the manager and composes group presets via `createScopes()`
- Group files define `packageRules` arrays. A generic manager-wide group may automerge its own minor updates (node, go, python, gitlab-ci, ansible-galaxy, otel-builder, docker); the multi-directory managers carry a catch-all that says `automerge: false` instead. Automerging a _named_ package is never done here — that is the parameterized `*-automerge-*` presets a consuming repository extends for itself; see the Automerge Pattern section.
- Minor/patch updates use `extends: [':semanticCommitTypeAll(feat)']`, major updates use `perf`
- **A dependency major is not a breaking change of the repository that consumes it — see the Breaking Marker section.** The conventional `!` is opt-in per manager, never estate-wide. Terraform is the one central exception.
- **Labels are additive — see the Labels section below.** `base.ts` holds the only `labels:` in the repo; everything else uses `addLabels`. Values always come from the `Labels` enum (`@constants`), never raw strings.
- `groupSlug` values come from the `Groups` enum (`@groups`). `Rings` enum (`@rings`) provides ring group slugs, which are **manager-qualified** (`node-fast-ring`, `go-fast-ring`) because renovate derives the branch name from the slug — a shared slug merges go and node updates of a polyglot repo into one MR.
- **A ring owns cadence and grouping only, and must be extended after the dep-type groups.** `groupName`, `groupSlug` and `schedule` are last-match-wins, so a `manager.ts` lists the groups first, then slow ring, then fast ring, then the `enabled: false` disables. Extended the other way round a ring silently stops applying to every update type a group also matches, and the ring's cadence is discarded. The converse binds too: because a ring rule lands last it must restate none of a group's fields — `semanticCommitType`, `commitMessageSuffix`, `ignoreTests` and `automerge` stay with the group that claimed the package, or a build dependency loses its pipeline. Ring rules therefore carry `automerge` nowhere; the groups grant it and the ring only re-scopes the branch.
- **Ring group rules are bounded by `matchUpdateTypes`.** Unbounded, a ring batches every major of its packages into one grouped merge request and holds them for the ring's cadence; majors keep their own branch instead.
- The `Preset` enum in `src/presets/index.ts` uses category prefixes: **real presets** (`default`, `base`, `lock-file`, `no-tests`, `branch-*`) no prefix; **managers** `manager-*`; **groups** `group-*`; **rings** `ring-*`; **datasources** `datasource-*`. New files must be registered in both the enum and the `PRESETS` record. The `manager-*-automerge-*` and `datasource-docker-automerge-*` presets are group-shaped but keep the manager/datasource prefix on purpose — consumers hardcode the name, and the prefix says which manager the argument is scoped to.
- `SCOPE` prefix (`local>renovate/renovate-config:default/`) is prepended to all preset references via `createScopes(Preset.X, ...)`.
- Conventional commits: `feat` for features, `fix` for fixes, `build(deps)` for dependency updates
- **Object spreads go first, explicit keys after** — `{ ...NODE_GROUP_DEV, groupName, groupSlug, schedule }`. A shared constant must never be able to silently clobber a local key.
- **Field patterns** — two shapes:
  - **Pattern M** (multi-directory: argocd, helm, kustomize, terraform): produced by `createMultiDirectoryGroupRule()` from `@lib`, which derives `additionalBranchPrefix: '{{packageFileDir}}-'`, `commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]'`, `group: { commitMessageTopic: '{{{groupName}}} [{{packageFileDir}}]' }`, the `groupName` and the automerge label. The directory belongs in `group.commitMessageTopic` and never in `groupName`: renovate drops `commitMessageExtra` from a multi-dependency branch when the deps resolve to different versions, so the grouped title comes from the group topic, and `group` is `mergeable: true` — which is what lets `group-by-unit` re-scope the token. `groupName` is last-match-wins and could only be re-scoped by restating every manager's name. `matchUpdateTypes` and the commit type are **passed in by the call site** — `matchUpdateTypes` as the renovate field, the commit type as `commitType` (which the factory wraps into `extends: [':semanticCommitTypeAll(<commitType>)']`) — so the factory bakes in no update-type set. The `groupName` update word (`minor`/`major`) is derived from whether `matchUpdateTypes` includes `major`. The factory deliberately emits no `enabled: true` — `enabled` is last-match-wins, so a default would silently re-enable dependencies an earlier, more specific rule disabled. Do not hand-write these rules — pass `name`, `matchUpdateTypes` and `commitType`; everything else is an ordinary `PackageRule` spread straight through, so call sites use renovate's own field names (`matchManagers`, `matchDepTypes`, `groupSlug`) and can override any derived field by passing it. `schedule` lives on the manager preset's own `matchManagers` rule.
  - **Pattern S** (single-directory: node, go, gitlab-ci, ansible-galaxy, otel-builder, docker-datasource): no `additionalBranchPrefix`, no `commitMessageExtra`; per-rule `schedule`.
- **`group-by-unit(<dir>)` re-scopes a repository from directories to units.** A parameterized preset — renovate substitutes `{{arg0}}` at preset-resolution time — that a consuming repo extends once per unit alongside `default/default`. It overrides `additionalBranchPrefix`, `commitMessageExtra` and `group.commitMessageTopic` for everything under `<dir>/**`, collapsing every directory in that unit onto one branch per group. Any new field carrying `{{packageFileDir}}` must be re-scoped here too, or the title falls back to whichever dependency renovate sorts first.
- **Never put `schedule` at the top level of a preset.** Top-level fields are non-mergeable and apply globally to the assembled config — the last extended preset that sets one wins for every dependency. Scope it to a `packageRules` entry instead.
- **A `SCHEDULE` hour window must be wider than the runner's cron cadence.** Renovate evaluates the window in `TIMEZONE` (Europe/Vienna) while the `renovate-runner` operator fires its `RenovateJob` crons on `time.Local`; the two only line up once `TZ` is set on the operator. A window narrower than the gap between runs can contain no run at all, and every update on it is parked in the dependency dashboard under "Awaiting Schedule" indefinitely. Nothing in this repo reports that — the symptom is silence.

## Automerge Pattern

**A breaking update never automerges without a bounded exact-name allowlist.** No rule may set `automerge: true` while matching `replacement`. A rule may set `automerge: true` while matching `major` only when it also carries `matchPackageNames` with exact names or a single `{{argN}}` preset argument — no globs, regexes, or negations; `test/presets.test.ts` enforces boundedness, not just presence. No automerge rule may omit `matchUpdateTypes` — an unbounded rule catches majors too. `lockFileMaintenance` is the one exemption: it is its own update type and carries no version bump. `test/presets.test.ts` enforces all three rules plus an effective-automerge test that resolves the rule chain for specific packages, with and without a substituted argument.

An argument satisfies boundedness by construction: renovate substitutes it with the consumer's literal package name before the rule is ever evaluated, so the braces are not minimatch brace expansion. This repo cannot see the substituted value — a consumer that passes a glob widens the rule, and keeping the argument a literal name is the consuming repository's contract.

Note that renovate rejects any rule setting `matchUpdateTypes` together with one of its 15 `preLookupOptions` — `rangeStrategy`, `versioning`, `registryUrls`, `allowedVersions`, `separateMajorMinor` and the rest — because those are resolved before the update type is known. Bounding an automerge rule by update type therefore means moving its `rangeStrategy` into a separate rule, as the node dependency, devDependency, peer and package-manager groups all do.

Two shapes, and which one a manager has is the whole policy:

1. **Generic group, automerges** — one rule over the manager's whole minor/patch surface (`matchPackageNames: ['*']`, a dep-type split, or a ring), `automerge: true`. node, go, python, gitlab-ci, ansible-galaxy and otel-builder work this way. The decision is "this manager's non-breaking updates are safe unattended", which is the same call in every repository, so it stays central.
2. **Catch-all, does not automerge** — the multi-directory managers (helm, kustomize, argocd, terraform) plus kubernetes, dockerfile and rust. Their group rule says `automerge: false`, and the `automerge: true` rule lives in the parameterized preset the consuming repository extends, which renovate appends after the whole central config and which therefore wins on last-match.

What no central rule may do any more is **automerge a hand-picked list of package names**. That was the old hack in the helm, kustomize, argocd and docker groups; it moved out to the per-repository presets. `docker/dockerfile` is the single exception and is generic in the same sense as row 1.

The docker datasource fits neither row cleanly, so do not read row 1 as covering it. Its one automerge rule is `automerge: true` but bounded to `docker/dockerfile`; every other image matches no automerge rule at all, which is unmatched rather than matched-and-denied. `datasource-docker-automerge-minor(<image>)` therefore does change behaviour for every image but that one.

For Pattern M the factory attaches `Labels.AUTOMERGE` automatically whenever `automerge: true`; Pattern S rules add it by hand.

### Parameterized automerge presets

**Automerge is opt-in per package, declared by the consuming repository — not by an allowlist here.** Every manager and datasource the central config handles has a minor and a major preset — 32 keys — each taking the package name as `{{arg0}}` via `matchPackageNames: ['{{arg0}}']`. A repository extends one of them once per package, after `default/default`:

Each row is a `-minor` / `-major` pair; the major twin always matches `['major']` alone and shares the minor twin's matchers.

| Preset key pair | Directory | Minor update types | Pattern | Group slug | Notes |
| --- | --- | --- | --- | --- | --- |
| `manager-helm-automerge-*` | `managers/helm/` | `minor`, `patch` | M | `helm-{minor,major}-automerge` | its own slug: the central helm group does not automerge |
| `manager-kustomize-automerge-*` | `managers/kustomize/` | `minor`, `patch` | M | `kustomize-{minor,major}-automerge` | `matchDepTypes: ['HelmChart']` on both levels |
| `manager-argocd-automerge-*` | `managers/argocd/` | `minor`, `patch`, `pin`, `digest`, `pinDigest` | M | `argocd-{minor,major}-automerge` | argument is a git URL, not a chart name |
| `manager-terraform-automerge-*` | `managers/terraform/` | `minor`, `patch` | M | `terraform-{minor,major}-automerge` | covers `module`, `provider`, `required_provider`, `helm_release` |
| `manager-terraform-custom-automerge-*` | `managers/terraform/custom-` | `minor`, `patch` | M | `terraform-monorepo-{minor,major}-automerge` | `custom.regex` scoped by the terraform monorepo dep type |
| `manager-node-automerge-*` | `managers/node/` | `minor`, `patch`, `pin`, `digest` | S | none — see below | no `schedule` either |
| `manager-go-automerge-*` | `managers/go/` | `minor`, `patch`, `digest` | S | none — see below | no `schedule` either |
| `manager-python-automerge-*` | `managers/python-pep621/` | `minor`, `patch`, `pin` | S | `python-minor`, `python-major-automerge` | no `digest`: pypi has none; minor reuses the central group's slug |
| `manager-rust-automerge-*` | `managers/rust-cargo/` | `minor`, `patch`, `pin` | S | `rust-{minor,major}-automerge` | no `digest`: crates.io has none |
| `manager-kubernetes-automerge-*` | `managers/kubernetes/` | `minor`, `patch`, `pin`, `digest` | S | `kubernetes-{minor,major}-automerge` | argument is an image reference |
| `manager-dockerfile-automerge-*` | `managers/dockerfile/` | `minor`, `patch`, `pin`, `digest` | S | `dockerfile-{minor,major}-automerge` | only images declared in a Dockerfile |
| `manager-ansible-galaxy-automerge-*` | `managers/ansible-galaxy/` | `minor`, `patch`, `pin`, `digest` | S | `ansible-galaxy-{minor,major}` | `matchDepTypes: ['collections', 'roles']`, `DAILY`; minor keeps the twin's `[skip ci]`, major does not |
| `manager-gitlab-ci-automerge-*` | `managers/gitlab-ci/` | `minor`, `patch`, `pin`, `digest` | S | `gitlab-ci-{minor,major}` | matches `gitlabci` and `gitlabci-include`, `ANY` |
| `manager-gitlab-ci-custom-automerge-*` | `managers/gitlab-ci/custom-` | `minor`, `patch`, `pin`, `digest` | S | `gitlab-ci-{minor,major}` | `custom.regex` scoped by the gitlab-ci monorepo dep type |
| `manager-otel-builder-automerge-*` | `managers/otel-builder/` | `minor`, `patch`, `digest` | S | `otel-builder-{minor,major}` | `DAILY`; minor reuses the central group's slug |
| `datasource-docker-automerge-*` | `datasources/docker/` | `minor`, `patch`, `pin`, `digest` | S | `docker-{minor,major}` | `matchDatasources: ['docker']`, `ANY`; minor reuses the central slug, which automerges only `docker/dockerfile` |

```json
{
  "extends": [
    "local>renovate/renovate-config:default/default",
    "local>renovate/renovate-config:default/manager-helm-automerge-minor(kube-prometheus-stack)",
    "local>renovate/renovate-config:default/manager-helm-automerge-major(kube-prometheus-stack)"
  ]
}
```

Five invariants hold these together, all enforced by `test/presets.test.ts`:

- **Nothing in this repo may extend one.** They are consumer entrypoints. Extending one from `default.ts` or a `manager.ts` would automerge that package everywhere, and would place the rule _before_ the group catch-all that says `automerge: false` instead of after it.
- **They are registered last** in the `Preset` enum and the `PRESETS` record, which models the position a consumer puts them in.
- **They reuse the central group's slug wherever that group automerges** — `docker-minor`, `python-minor`, `ansible-galaxy-minor`, `gitlab-ci-minor` and `otel-builder-minor`. An opt-in then shares a branch with the central group rather than opening a second MR, and one slug is one name, so the `groupName` must match the central one exactly. Where the central group is a catch-all that says `automerge: false` — helm, kustomize, argocd, terraform — the opt-in carries its own `*-automerge` slug and is the only rule that uses it. That split is not cosmetic: renovate sets a grouped branch's `automerge` to `upgrades.every((upgrade) => upgrade.automerge)` (`dist/workers/repository/updates/generate.js:247`), so an opt-in that joined a catch-all's branch would stop automerging the moment any other dependency landed on it. `test/presets.test.ts` (`never shares a group slug between an automerging and a non-automerging rule`) enforces it.
- **`manager-node-automerge-*` and `manager-go-automerge-*` carry no `groupSlug` and no `schedule`.** Node groups by dep type (`dev`, `build`, `docs`, `peer`, `package-manager`) and both node and go group by ring. `groupSlug`, `groupName` and `schedule` are all last-match-wins, so an opt-in that named a group would pull the package out of the MR it belongs in and discard its ring schedule. Those two presets flip `automerge` and nothing else.
- **No Pattern S opt-in sets a commit type.** `semanticCommitType` is last-match-wins, and the node build and docs groups own it (`build`, `docs`) — a `feat` on an opt-in rule would clobber it for those packages. Pattern M opt-ins do carry `feat` / `perf`, because the factory requires a `commitType` and no Pattern M manager assigns a per-group type.

Each one adds `Labels.RENOVATE` alongside `Labels.AUTOMERGE`: a repository may extend it without `base`, and without the umbrella there it would get no labels at all.

**Every parameterized preset also adds `Labels.OVERRIDE` (`renovate:override`)** — the automerge pair and the breaking pair alike, 64 keys. A repository extends one of these to overrule what the estate-wide config decided, so the label answers "why is this merge request behaving differently from the others" without anyone opening that repository's `renovate.json`. `group-by-unit` is parameterized but deliberately does **not** carry it: it applies to every dependency under its directory, so the label would land on every merge request in the repository and stop telling them apart. `test/presets.test.ts` enforces both halves — only a parameterized preset may add it, and every one of them must.

A new `-automerge-minor` / `-automerge-major` key must be added to `AUTOMERGE_PRESETS` in `test/presets.test.ts`; a registry test fails if the name matches the pattern and the list does not carry it.

**None of them carries `matchSourceUrls`**, where the retired helm and kustomize allowlists did. A chart that happens to share a name with an opted-in one, published from a different upstream repository, therefore matches too. Accepted: the argument is scoped to one repository's config, which is where the chart's origin is already known.

### What the central config automerges

Generic minor/patch groups, one per manager, unchanged by the allowlist migration:

| Manager / datasource                   | File                                   | Slug                                                                                   |
| -------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- |
| node dependencies                      | `groups/node/minor-dependencies.ts`    | `node-minor`                                                                           |
| node dev, build, docs, package manager | `groups/node/dev-dependencies.ts`      | `node-dev`, `node-build`, `node-docs`, and a slugless rule over `node-package-manager` |
| node peer                              | `groups/node/peer-dependencies.ts`     | `node-peer`                                                                            |
| go                                     | `groups/go/minor-dependencies.ts`      | `go-minor`                                                                             |
| python                                 | `groups/python/minor-dependencies.ts`  | `python-minor`                                                                         |
| gitlab-ci                              | `groups/gitlab-ci/minor-updates.ts`    | `gitlab-ci-minor`, for the include manager and the `custom.regex` monorepo rule        |
| ansible-galaxy                         | `groups/ansible-galaxy/minor-roles.ts` | `ansible-galaxy-minor`                                                                 |
| otel-builder                           | `managers/otel-builder/manager.ts`     | `otel-builder-minor`                                                                   |
| docker datasource                      | `datasources/docker/datasource.ts`     | `docker-minor` — bounded to `docker/dockerfile`                                        |

`test/presets.test.ts` pins that list in `CENTRAL_AUTOMERGE` (`automerges centrally only where the inventory says so`), so a central automerge appearing or disappearing fails the suite until the list is updated deliberately. Two more guards sit beside it: `never automerges a major update centrally` — the bounded-allowlist exception for majors belongs to the parameterized presets alone — and `never disables a rule that automerges centrally`, which catches a generic group switched off while still counted in the inventory.

The inventory is a list of names, so `effective automerge` asserts the behaviour behind it: one dependency per manager that no repository has opted in, expected to automerge its minor centrally for the generic managers and not to for the catch-all ones. Package matchers there resolve through renovate's own `matchRegexOrGlobList`, so a group's `['*']`, a dep group's `!name` negations and a ring's `/regex/` all match the way they do at runtime. Narrowing a generic group to a package list therefore fails a case in that table, not just the inventory. The same table's `keeps automerging <case> when another package is passed as the argument` holds the other direction: an opt-in adds a package and never scopes a central automerge down to the one it names.

**`docker/dockerfile` is the only package name a central rule automerges**, and `never automerges a central package-name allowlist` enforces that. It is the Dockerfile syntax directive, not an application image — generic to every repository that builds one, which is why it stayed when the chart and image allowlists left. The node build and docs groups also name packages, but only to route them into a `build:` or `docs:` merge request: every devDependency automerges either way, so they are exempt from that check.

`lockFileMaintenance` in `lock-file.ts` is the standing exemption both tests skip: it is its own update type and carries no version bump.

**What did move out**, per manager, and now lives only in the parameterized presets: `kube-prometheus-stack` and `opentelemetry-operator` (helm, both levels); `prometheus-blackbox-exporter`, `alloy` and `gitlab-runner` (kustomize, both levels); the `chart-prometheus-operator` and `chart-opentelemetry-operator` git URLs (argocd, both levels); the opentelemetry-collector-contrib and `renovate/renovate` images (docker datasource). The `matchSourceUrls` lists that scoped the helm and kustomize entries went with them.

### Opting a package back out — `no-automerge`

Every `-automerge-` preset has a `-no-automerge-` twin that inverts it, mirroring its matchers and `matchUpdateTypes` exactly. A repository extends one to hold a single package back from a group that automerges. A test enforces the mirroring, so widening a central group's update types without widening its opt-out fails the suite.

**`automerge: false` alone does not work, and the way it fails is silent.** Renovate resolves a branch's automerge as `config.upgrades.every((upgrade) => upgrade.automerge)` (`dist/workers/repository/updates/generate.js:250`), and nothing downstream reads a per-upgrade flag — `update/branch/index.js:721` and `update/branch/automerge.js:10` both read the branch-level one. So an opt-out that only flipped the flag would leave the package on the shared branch and take automerge away from **every other dependency on it**. Holding back one package would quietly stop the whole `node-minor` merge request from automerging.

The package therefore has to leave the branch first, and `createNoAutomergeRule()` does that with **`groupName: null`**:

- `null` is renovate's own default for the option (`config/options/index.js:2512`), and `generate.js:129` keys "is this a group" on `groupName !== null`.
- `branch-name.js:42` skips the entire group block when it is falsy, so `groupSlug`, the `separate*` slug prefixes and the `group.branchTopic` override are all bypassed and the branch falls back to the per-dependency `branchTopic`.
- `config/utils.js:14` merges child over parent with a plain object spread, so a later `null` overwrites the group's string; the mergeable loop below it is gated on truthiness, so null never reaches it.
- `validation.js:240` skips every type check for null, and `presets/index.js:70` passes null through `replaceArgs` untouched, so it survives inside a parameterized preset.

**The string `'null'` is not special anywhere in renovate** — that would be a literal group named "null".

`groupName` ships as `string | undefined` even though null is its own default, and TypeScript declaration merging cannot widen an existing property, so the null arrives through a single cast inside the factory rather than one per call site.

**There is deliberately no `createAutomergeRule()`.** The factories here exist to encode a mechanism that is wrong when hand-written — the `every()` trap above, and the templated commit prefix below. Granting automerge has no such trap: it is `automerge: true` plus a label. It also could not cover the ten Pattern M presets, which pass `automerge: true` _into_ `createMultiDirectoryGroupRule()`, where it derives both the `' automerge'` groupName suffix and the label — two factories claiming the same field. The real gap it would have closed, Pattern S adding `Labels.AUTOMERGE` by hand, is closed by the `always labels a rule that automerges` test instead, which covers Pattern M too.

**Do not extend both halves of a pair for the same package — the outcome is the consuming repository's to control, not this repo's.** Renovate concatenates `packageRules` in the order the consumer lists its `extends` (`config/presets/index.js:141-153` into `config/utils.js:25`); the order of keys inside `default.json` is irrelevant to it. So whichever half the repository names **last** wins, and the result of naming both is worse than either alone: `automerge: true` from the opt-in lands last while `groupName: null` still applies, because only the opt-out sets it — the package then automerges by itself on its own branch, off the group merge request it was supposed to be held back from.

The `registered last` ordering in the `Preset` enum **models** where a consumer is expected to put these lines. It does not cause the precedence, and `test/presets.test.ts` resolves rules in that registry order for the same reason — as a model of the documented usage, not as a guarantee about a repository that deviates from it.

## Breaking Marker

**A dependency major is not a breaking change of the repository that consumes it.** `!` in a conventional commit means _this package's own contract broke_; a dependency moving to v2 says nothing about that. The estate therefore does not mark majors breaking by default, and one central rule that did was reverted — see below for what it cost.

### Why it matters more than a title

The shared release preset pins `conventionalcommits` (`semantic-release-config/constants.js`), whose parser carries `breakingHeaderPattern` (`conventional-changelog-conventionalcommits/src/parser.js:4`). A matching header pushes a `BREAKING CHANGE` note (`conventional-commits-parser/dist/CommitParser.js:237`), and commit-analyzer's **first** default rule is `{ breaking: true, release: 'major' }` (`lib/default-release-rules.js`), which wins over the type entirely. So the marker does not decorate a title — it cuts a MAJOR release of every repository that inherits it. A `docs(deps)!` or `build(deps)!` devDependency bump, which released nothing at all before, would ship a major.

### The mechanism

Renovate assembles its own `type(scope):` prefix only while `commitMessagePrefix` is unset (`!upgrade.commitMessagePrefix`, `dist/workers/repository/updates/generate.js:53`), and it has no slot for the `!`. Supplying a prefix **replaces** that assembly rather than adding to it, which is why `createBreakingMajorRule()` in `@lib` rebuilds what renovate would have produced — the `if (semanticCommitScope)` branch included — and appends the marker. The type stays the template `{{semanticCommitType}}`: a literal `perf(deps)!:` would flatten `fix`, `build`, `docs`, `ci` and `perf` onto one type for every major in the estate.

Supplying a prefix also skips the branch that sets renovate's internal `toLowerCase` flag (`generate.js:58`). That flag lowercases the **entire first line** (`generate.js:71-74`), not just the action word, so `commitMessageAction: 'update'` restores only the part the factory can reach. A manager-specific `commitMessageTopic` keeps its own capital on a marked major: terraform's `Terraform {{depName}}` (`modules/manager/terraform/index.js:32`) and cargo's `Rust crate {{depName}}` (`cargo/index.js:31`), and any mixed-case package name such as `PyYAML`. So `perf(deps): update terraform hashicorp/aws to v6` becomes `perf(deps)!: update Terraform hashicorp/aws to v6`. Cosmetic — the analyzer reads the type and the marker, not the casing — but do not expect a marked title to be byte-identical to an unmarked one beyond the prefix.

`createNoBreakingMajorRule()` is the inverse and unmarks with `commitMessagePrefix: ''` — **empty rather than absent**, because the field is last-match-wins and an opt-out that merely omitted it would leave the central marker standing. `''` is falsy at `generate.js:53`, which puts renovate back on its own assembly and back on the `toLowerCase` flag, hence `commitMessageAction: 'Update'`, renovate's own default.

Both factories force `matchUpdateTypes: ['major']` and withhold it, plus the two commit-message fields, from their parameter type. Unlike `createMultiDirectoryGroupRule()` the spread goes **first** and the owned fields last: they are the point of the factory, not a default a call site may override.

### The policy

| Scope | Default | How a repository changes it |
| --- | --- | --- |
| terraform, terraform-custom | **breaking** — a provider, module or release major moves what the repository's own state is pinned to, so the plan it produces is not the plan the previous version produced | `manager-terraform-no-breaking-major` to opt out |
| every other manager and datasource | **not breaking** | `manager-<name>-breaking-major` to opt in |

Both idioms exist for all 16 managers and datasources, so a repository declares its intent rather than inheriting a default — and the declaration survives a change to the central default. `test/presets.test.ts` (`breaking marker`) pins the central set in `CENTRAL_BREAKING`, so a manager gaining or losing the marker has to be a deliberate edit.

**These presets flip the commit prefix and nothing else.** `groupName`, `groupSlug` and `schedule` are last-match-wins and these land after everything, so naming a group would pull the dependency out of the merge request it belongs in and discard its cadence. A test enforces their absence.

### Sharp edges

Verified against renovate 44.69.13; none is a blocker, and each is invisible until it bites.

- **The marker ignores `semanticCommits`.** Renovate guards its own prefix assembly with `semanticCommits === 'enabled' && !commitMessagePrefix` (`generate.js:53`); a supplied prefix carries no such guard. `base.ts` sets `semanticCommits: 'enabled'` at the top level, but that field is non-mergeable, so a consumer setting `auto` or `disabled` turns off every other prefix while a marked manager's majors still emit `chore(deps)!:` — `chore` and `deps` being the option defaults. There is no way to condition a `packageRule` on `semanticCommits`, so this is documented rather than fixed.
- **A mixed grouped branch takes the marker from whichever dependency sorts first.** After the depName sort renovate does `config = { ...config, ...config.upgrades[0] }` (`generate.js:217-229`), and `commitMessagePrefix` is **not** reconciled across upgrades the way `automerge`, `labels` and `updateType` are (`:250-253`). Two managers sharing a `groupSlug` — `gitlabci` and its `custom.regex` twin on `gitlab-ci-major`, or the docker datasource against `dockerfile` / `kubernetes` on `docker-major` — will carry the `!` only if the marked one happens to sort first. **Extend both twins of a manager that has a `custom-` variant**, or the marker is non-deterministic on shared branches.
- **`no-automerge` is never a no-op, even where nothing automerges.** On the catch-all managers (helm, kustomize, argocd, terraform) the central group already says `automerge: false`, but the opt-out still sets `groupName: null`, so the package leaves the grouped merge request and gets its own branch. That is a grouping change, not a no-op — reach for it there only if the separate branch is what you want.
- **`sharedVariableName` re-groups an ungrouped dependency.** `branch-name.js:38-41` reads `if (!update.groupName && update.sharedVariableName) update.groupName = update.sharedVariableName`, so for managers that emit one — gitlab-ci `variables:`, dockerfile `ARG` — an opted-out package lands on `renovate/<variable>` rather than the per-dependency topic. The opt-out still holds: the group's other dependencies keep their string `groupName` and so a different branch, and `automerge` stays false.
- **A future override must not set `semanticCommitType` on a Pattern M manager.** `extends: [':semanticCommitTypeAll(perf)']`, which `createMultiDirectoryGroupRule()` puts on every Pattern M rule, resolves to a **nested** `packageRules` entry that `applyPackageRules` appends after every top-level rule (`util/package-rules/index.js:55`) and evaluates on a second pass (`flatten.js:83,86`). So on argocd, helm, kustomize and terraform the group's commit type lands _after_ anything an override sets, and would silently clobber it. Harmless today — no override sets `semanticCommitType`, and the breaking marker deliberately reads the type through `{{semanticCommitType}}` rather than setting it — but the registry-order walker in the tests cannot see this, so it will not warn you.

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
| override   | every parameterized preset                           | `renovate:override`                                                               |

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
- The options used here that are `mergeable: true` are `addLabels`, `packageRules`, `customManagers`, `group`, `lockFileMaintenance`, `ignoreDeps`, `postUpdateOptions` and the `match*` list matchers. `group` merging is why a later rule can override `commitMessageTopic` without clobbering the default `branchTopic`. Note `lockFileMaintenance` merging means `lock-file.ts` composes with `config:recommended`'s block rather than replacing it. Everything else is last-match-wins, including `automerge`, `enabled`, `groupName`, `groupSlug`, `rangeStrategy`, `semanticCommitType`, `minimumReleaseAge` and the `commitMessage*` family — those are safe to broad-then-override.
- `schedule` is an array but **not** mergeable, so a per-rule `schedule` silently discards a hoisted one instead of adding to it.
- `packageRules` order across presets is positional: `P1 → P2 → P3 → the extending config's own rules`. Preset identity does not matter, only position in `extends`.

`update:*` deliberately does not cover `rollback` — `rollbackPrs` defaults to `false` and this config never enables it. `lockFileMaintenance` is not a matchable update type; it carries `dep:lock` from `lock-file.ts`. `rings/node/none.ts` gets no ring label because every rule in it is `enabled: false`.

Every manager, datasource and ring preset carries an **identity rule** — a `matchManagers` / `matchDatasources` / package-set rule whose only job is `addLabels`. Keep identity separate from behaviour: never hang the identity label off a group rule, or it stops applying to updates that rule does not match.

Manager and datasource identity rules also re-add `Labels.RENOVATE`. Each preset ships as its own key in `default.json`, so a repository can extend `default/manager-helm` without `base` — without the umbrella there it would get no labels at all. The duplicate is free because renovate dedupes the final set.

Adding a manager means adding its `manager:<name>` label, wiring the identity rule and including the umbrella. `test/presets.test.ts` catches a missing umbrella and an orphaned label, but its manager table is opt-in — add the new manager to it, or that manager is unchecked.

## Renovate Documentation References

When modifying or creating package rules, always consult the official Renovate docs:

- **packageRules:** https://docs.renovatebot.com/configuration-options/#packagerules — the core mechanism this repo uses. Rules are evaluated **in order** and **all matching rules are applied** (not just the first match). Later rules override earlier ones for the same field, so **order matters**: place broad catch-all rules first, then specific overrides (like automerge) after. This is why a consumer's `*-automerge-*` extends line has to come after `default/default` — it lands after the group catch-all that says `automerge: false`.
- **matchSourceUrls:** https://docs.renovatebot.com/configuration-options/#matchsourceurls — matches the upstream source repository URL of a dependency.
- **matchPackageNames:** https://docs.renovatebot.com/configuration-options/#matchpackagenames — supports exact names, globs, and regex. In this repo we use exact names, or a single `{{arg0}}` preset argument that resolves to one.
- **matchManagers:** https://docs.renovatebot.com/configuration-options/#matchmanagers — scopes a rule to specific package managers (e.g., `kustomize`, `helmv3`, `argocd`).
- **matchUpdateTypes:** https://docs.renovatebot.com/configuration-options/#matchupdatetypes — `major`, `minor`, `patch`, `pin`, `digest`, etc.
- **matchDepTypes:** https://docs.renovatebot.com/configuration-options/#matchdeptypes — e.g., `HelmChart` for kustomize helm chart dependencies.
- **automerge:** https://docs.renovatebot.com/configuration-options/#automerge — when `true`, Renovate auto-merges the MR if pipeline passes.
- **groupName / groupSlug:** https://docs.renovatebot.com/configuration-options/#groupname — groups multiple updates into a single MR.
- **schedule presets:** https://docs.renovatebot.com/presets-schedule/ — predefined schedule expressions used in `src/constants/renovate.ts`.

**Key rule:** `packageRules` are additive and last-match-wins per field. A package can match multiple rules — each matching rule's fields are merged, with later rules taking precedence. This is the foundation of the catch-all + specific-override pattern used throughout this repo.

## Building & Validating

```bash
pnpm build # transpile TypeScript (no type checking)
pnpm lint  # eslint ./src
pnpm test  # invariant tests over the assembled presets
pnpm start # generate default.json + validate with renovate's built-in validator
```

After any change run `pnpm build && pnpm start` and verify `default.json` includes the expected rules. `default.json` is **committed**, and the CI `generate` job regenerates it as an artifact — it no longer gates on `git diff`, because semantic-release regenerates and commits it back on release. Still regenerate and commit it with your change so the committed file stays in sync. Validation errors are fatal: `pnpm start` reports every error across every preset, then exits non-zero.

## Gotchas

- **`pnpm start` runs the last build, not the source.** `bin/run.js` loads `dist/`, so `pnpm start` without a preceding `pnpm build` regenerates `default.json` from stale code. Always `pnpm build && pnpm start`.
- **Nothing type-checks.** `pnpm build` transpiles through Oxc, and `dts: true` emits declarations via `rolldown-plugin-dts`, which never calls `getSemanticDiagnostics`. Its only failure branch is `emitSkipped && diagnostics.length`, and those come from the `EmitResult` — declaration-emit problems (`TS4053` and friends), not type errors. Its `noEmitOnError: true` default is inert, because that flag is implemented in TypeScript's compiler driver, not in `program.emit()`. Measured: with a `string` assigned to `lockFileMaintenance.enabled`, `pnpm build` exits 0 while `tsc --noEmit -p tsconfig.test.json` exits 2. `dts: { build: true }` behaves the same — it takes the `createSolutionBuilder` path, which is for a tsconfig with `references`, and this one has none. `pnpm start` validates renovate _config_, not _types_. Run `tsc --noEmit -p tsconfig.test.json` by hand when touching `src/lib`, `src/commands`, or the type declarations.
- **`lib` is pinned to `es2024`** in `tsconfig.json` because `@typescript-eslint/scope-manager@8.57.0` doesn't recognize `es2025.iterator` (which TS 6 resolves `ESNext.Iterator` to). Unpinning will break `pnpm lint`.
- **`PackageRule` is augmented** in `src/types/renovate-augment.d.ts` because renovate 43.139 removed `additionalBranchPrefix` and `commitMessageSuffix` from its public `PackageRule` type even though both still work at runtime. Do not remove the augmentation.
- **`renovate/dist/config/migration.js` and `validation.js` have no shipped types** — ambient declarations live in `src/types/renovate-modules.d.ts`.
- **`default.json` is prettier-ignored.** It is generated, and prettier's formatting disagrees with the generator's. Without the ignore entry the `lint-staged` pre-commit hook rewrites the file on every commit, so the committed file would no longer match the generator output.
- **`createPreset()` takes `Omit<RenovateConfig, 'schedule'>`** — one factory for every preset, `base.ts` included. Excess-property checking catches misspelled renovate fields and keeps the non-mergeable `schedule` off a preset's top level. `labels` stays allowed because `base.ts` owns the umbrella label; `test/presets.test.ts` (`declares labels only in the base preset`) is what enforces that no other preset sets it. Do not widen the parameter to `RenovateConfig & Record<PropertyKey, any>` — that silently disables the check for every preset.
- **Kubernetes per-manager config** (`[Managers.KUBERNETES]: {...}` in `managers/kubernetes/manager.ts`) is cast with `as RenovateConfig` — the shape is valid at runtime but absent from the public type. This is the only cast in `src/`; if another preset needs one, prefer fixing the type augmentation.
