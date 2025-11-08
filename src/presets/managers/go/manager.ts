import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.GO],
  extends: createScopes(Preset.GO_SLOW_RING_PACKAGES, Preset.GO_FAST_RING_PACKAGES, Preset.GO_GROUP_MINOR_DEPENDENCIES),
  postUpdateOptions: ['gomodTidy', 'gomodUpdateImportPaths'],
  packageRules: [
    {
      matchManagers: [Managers.GO],
      addLabels: ['go']
    }
  ]
})
