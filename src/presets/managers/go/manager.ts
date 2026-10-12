import { Labels } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.GO],
  extends: createScopes(Preset.GROUP_GO_MINOR_DEPENDENCIES, Preset.RING_GO_SLOW, Preset.RING_GO_FAST),
  postUpdateOptions: ['gomodTidy', 'gomodUpdateImportPaths'],
  packageRules: [
    {
      matchManagers: [Managers.GO],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_GO]
    },
    // Renovate's gomod extractor already disables `// indirect` requires. Restated so that posture survives
    // an upstream preset or default re-enabling them; it lands after the groups and rings so nothing overrides it.
    {
      matchManagers: [Managers.GO],
      matchDepTypes: ['indirect'],
      enabled: false
    }
  ]
})
