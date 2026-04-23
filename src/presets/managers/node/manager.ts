import { Labels } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

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
    }
  ]
})
