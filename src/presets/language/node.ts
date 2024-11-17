import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.NODE],
  extends: createScopes(
    Preset.NODE_NO_RING,
    Preset.NODE_SLOW_RING,
    Preset.NODE_FAST_RING,
    Preset.NODE_GROUP_DEV_DEPENDENCIES,
    Preset.NODE_GROUP_MINOR_DEPENDENCIES,
    Preset.NODE_GROUP_PEER_DEPENDENCIES
  )
})
