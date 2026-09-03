import { Labels, MINIMUM_RELEASE_AGE } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'
import { NODE_FAST_RING_PACKAGES } from '@presets/rings/node/rings.js'

export default createPreset({
  enabledManagers: [Managers.NODE],
  extends: createScopes(
    Preset.RING_NODE_NONE,
    Preset.RING_NODE_SLOW,
    Preset.RING_NODE_FAST,
    Preset.GROUP_NODE_DEV_DEPENDENCIES,
    Preset.GROUP_NODE_MINOR_DEPENDENCIES,
    Preset.GROUP_NODE_PEER_DEPENDENCIES
  ),
  packageRules: [
    {
      matchManagers: [Managers.NODE],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_NODE]
    },
    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_FAST_RING_PACKAGES.map((p) => `!${p}`),
      minimumReleaseAge: MINIMUM_RELEASE_AGE
    },
    // A repository `pnpm-workspace.yaml` that sets `minimumReleaseAge` also turns
    // `minimumReleaseAgeStrict` on, so renovate's native pnpm lockfile update aborts with
    // ERR_PNPM_NO_MATURE_MATCHING_VERSION whenever a transitive dependency is younger than the
    // window. Renovate then commits `package.json` alone and CI fails on `pnpm i --frozen-lockfile`.
    // Regenerating the lockfile once per branch with strict mode off keeps the two in sync.
    // Scoped to a packageRule rather than the preset top level: `postUpgradeTasks` is
    // non-mergeable, and `default` extends every manager preset, so at the top level this would
    // run pnpm on helm, terraform and kustomize branches too.
    {
      matchManagers: [Managers.NODE],
      postUpgradeTasks: {
        commands: ['pnpm install --lockfile-only --config.minimum-release-age-strict=false'],
        fileFilters: ['pnpm-lock.yaml'],
        executionMode: 'branch'
      }
    }
  ]
})
