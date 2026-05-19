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
      addLabels: [Labels.NODE]
    },
    {
      matchManagers: [Managers.NODE],
      matchPackageNames: ['*', ...NODE_FAST_RING_PACKAGES.map((p) => `!${p}`)],
      minimumReleaseAge: MINIMUM_RELEASE_AGE
    }
  ]
})
