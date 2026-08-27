Add automerge for a package: $ARGUMENTS

## Instructions

The user wants to enable Renovate automerge for a specific package. **Automerge is opt-in per package and is declared in the consuming repository, not here.** This repository only ships the parameterized presets; enabling a package means editing that repository's `renovate.json`.

### 1. Identify the manager and the package name

From the user's input, determine:

- **Manager:** which Renovate manager handles the dependency, or whether it is a `docker` datasource dependency. The MR description names it.
- **Package name:** the exact name as Renovate sees it — a chart name (`kube-prometheus-stack`), a git URL for argocd (`git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git`), or an image name for docker (`renovate/renovate`)

If either is unclear, the existing Renovate MR for the package shows the manager and the package name in its description. Ask the user for the MR URL if needed.

### 2. Pick the preset keys

Every manager and datasource has a pair. Pick by which manager resolves the dependency:

| Manager / datasource        | Preset key pair (append `-minor` or `-major`) |
| --------------------------- | --------------------------------------------- |
| `helmv3`                    | `manager-helm-automerge-*`                    |
| `kustomize`                 | `manager-kustomize-automerge-*`               |
| `argocd`                    | `manager-argocd-automerge-*`                  |
| `terraform`                 | `manager-terraform-automerge-*`               |
| `custom.regex` in `.tf`     | `manager-terraform-custom-automerge-*`        |
| `npm`                       | `manager-node-automerge-*`                    |
| `gomod`                     | `manager-go-automerge-*`                      |
| `pep621`                    | `manager-python-automerge-*`                  |
| `cargo`                     | `manager-rust-automerge-*`                    |
| `kubernetes`                | `manager-kubernetes-automerge-*`              |
| `dockerfile`                | `manager-dockerfile-automerge-*`              |
| `ansible-galaxy`            | `manager-ansible-galaxy-automerge-*`          |
| `gitlabci`, `gitlabci-include` | `manager-gitlab-ci-automerge-*`            |
| `custom.regex` in `.gitlab-ci.yml` | `manager-gitlab-ci-custom-automerge-*` |
| `ocb`                       | `manager-otel-builder-automerge-*`            |
| `docker` datasource         | `datasource-docker-automerge-*`               |

Add the **minor** preset by default. Add the **major** one only when the user asks for it and the package's major version tracks an upstream dependency bump rather than a breaking change.

The central config automerges nothing by itself apart from `docker/dockerfile`, so every key here changes behaviour — there is no manager whose minor updates already merge on their own.

The `npm` and `gomod` keys leave grouping alone by design: an opted-in package stays in its dep-type or ring merge request, and that branch automerges only once every package on it is opted in too. For a repository with many node dependencies, opting a single one in may therefore never merge unattended — say so rather than letting the user assume it took effect.

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

Do not add the package to a `matchSourceUrls` or `matchPackageNames` allowlist in `src/presets/groups/`. Those central allowlists are gone: `docker/dockerfile` is the only package name the central config still automerges, and `test/presets.test.ts` (`only automerges the dockerfile syntax directive centrally`) fails on a new one. Do not extend an automerge preset from `default.ts` or any `manager.ts` — the same file fails if one becomes reachable from `default`.

### 5. Commit in the consuming repository

Use conventional commit format: `feat: automerge <package>`.
