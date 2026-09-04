import { Labels, MINIMUM_RELEASE_AGE } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'
import { NODE_FAST_RING_PACKAGES } from '@presets/rings/node/rings.js'

export default createPreset({
  enabledManagers: [Managers.NODE],
  // Order is the whole ring mechanism. `groupName`, `groupSlug` and `schedule` are last-match-wins, so
  // whichever preset comes last owns them: the dep-type groups first, then the rings that re-scope them
  // onto a cadence, then the disables, which have to outlive everything. Extend a ring before its groups
  // and it silently stops applying to every update type the groups also match.
  extends: createScopes(
    Preset.GROUP_NODE_DEV_DEPENDENCIES,
    Preset.GROUP_NODE_MINOR_DEPENDENCIES,
    Preset.GROUP_NODE_PEER_DEPENDENCIES,
    Preset.RING_NODE_SLOW,
    Preset.RING_NODE_FAST,
    Preset.RING_NODE_NONE
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
    }
  ]
})
