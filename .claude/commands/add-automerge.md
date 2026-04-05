Add automerge for a package: $ARGUMENTS

## Instructions

The user wants to enable Renovate automerge for a specific package. Follow these steps:

### 1. Identify the manager and package

From the user's input, determine:
- **Manager:** Which Renovate manager handles this package (kustomize, helm, argocd, terraform, etc.)
- **Package name:** The exact package name as Renovate sees it (e.g., `alloy`, `kube-prometheus-stack`, or a git URL for argocd)
- **Source URL:** The source repository URL (e.g., `https://github.com/grafana/helm-charts`)

If any of these are unclear, check the existing Renovate MR for the package — it shows the manager, source URL, and package name in the MR description. Ask the user for the MR URL if needed.

### 2. Find the group files

Automerge rules live in the group files under `src/presets/managers/<manager>/`. Each manager has separate files for minor and major updates:

| Manager | Minor file | Major file |
|---------|-----------|------------|
| kustomize | `group-minor-helm-releases.ts` | `group-major.ts` |
| helm | `group-minor.ts` | `group-major.ts` |
| argocd | `group-minor.ts` | `group-major.ts` |

### 3. Add to automerge rules

In **both** the minor and major group files, find the automerge rule (the one with `automerge: true`) and add:
- The source URL to the `matchSourceUrls` array (if not already present)
- The package name to the `matchPackageNames` array

**Important:** If the source URL already exists in the array (another package from the same source is already automerged), only add the package name.

### 4. Build and validate

Run `pnpm build && pnpm start` to regenerate `default.json` and validate the configuration.

### 5. Commit

Use conventional commit format: `fix: add <package> to <manager> automerge`
