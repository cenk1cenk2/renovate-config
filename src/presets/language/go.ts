import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

import { Managers } from '@constants'

export default createPreset({
  enabledManagers: [ Managers.GO ],
  extends: createScopes(Preset.GO_SLOW_RING_PACKAGES, Preset.GO_FAST_RING_PACKAGES, Preset.GO_GROUP_MINOR_DEPENDENCIES),
  postUpdateOptions: [ 'gomodTidy', 'gomodUpdateImportPaths' ]
})
