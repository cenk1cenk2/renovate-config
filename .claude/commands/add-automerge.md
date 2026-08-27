Add automerge for a package: $ARGUMENTS

## Instructions

The user wants to enable Renovate automerge for a specific package. **Automerge is opt-in per package and is declared in the consuming repository, not here.** This repository only ships the parameterized presets; enabling a package means editing that repository's `renovate.json`.

### 1. Identify the manager and the package name

From the user's input, determine:

- **Manager:** which Renovate manager handles the dependency (`helm`, `kustomize`, `argocd`, `otel-builder`) or whether it is a `docker` datasource dependency
- **Package name:** the exact name as Renovate sees it — a chart name (`kube-prometheus-stack`), a git URL for argocd (`git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git`), or an image name for docker (`renovate/renovate`)

If either is unclear, the existing Renovate MR for the package shows the manager and the package name in its description. Ask the user for the MR URL if needed.

### 2. Pick the preset keys

| Manager / datasource | Minor preset                            | Major preset                            |
| -------------------- | --------------------------------------- | --------------------------------------- |
| `helm`               | `manager-helm-automerge-minor`          | `manager-helm-automerge-major`          |
| `kustomize`          | `manager-kustomize-automerge-minor`     | `manager-kustomize-automerge-major`     |
| `argocd`             | `manager-argocd-automerge-minor`        | `manager-argocd-automerge-major`        |
| `otel-builder`       | `manager-otel-builder-automerge-minor`  | `manager-otel-builder-automerge-major`  |
| `docker` datasource  | `datasource-docker-automerge-minor`     | `datasource-docker-automerge-major`     |

Add the **minor** preset by default. Add the **major** one only when the user asks for it and the package's major version tracks an upstream dependency bump rather than a chart-level breaking change.

### 3. Extend the preset in the consuming repository

Append to `extends` in that repository's `renovate.json`, **after** `default/default`, once per package:

```json
{
  "extends": [
    "local>renovate/renovate-config:default/default",
    "local>renovate/renovate-config:default/manager-helm-automerge-minor(kube-prometheus-stack)",
    "local>renovate/renovate-config:default/manager-helm-automerge-major(kube-prometheus-stack)"
  ]
}
```

The argument must be a literal package name. A glob passed here widens the rule silently — this repository cannot see the substituted value, so boundedness is the consuming repository's contract.

Order matters: the preset carries `automerge: true` and has to land after the group catch-all that says `automerge: false`.

### 4. Nothing to change in this repository

Do not add the package to a `matchSourceUrls` or `matchPackageNames` allowlist in `src/presets/groups/`. Those central allowlists are the pattern being retired and are removed once every consumer has migrated. Do not extend an automerge preset from `default.ts` or any `manager.ts` — `test/presets.test.ts` fails if one becomes reachable from `default`.

### 5. Commit in the consuming repository

Use conventional commit format: `feat: automerge <package>`.
