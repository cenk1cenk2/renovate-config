import { Labels } from '@constants'
import { Managers } from '@managers'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.GO],
  extends: createScopes(Preset.RING_GO_SLOW, Preset.RING_GO_FAST, Preset.GROUP_GO_MINOR_DEPENDENCIES),
  postUpdateOptions: ['gomodTidy', 'gomodUpdateImportPaths'],
  packageRules: [
    {
      matchManagers: [Managers.GO],
      addLabels: [Labels.GO]
    }
  ]
})
