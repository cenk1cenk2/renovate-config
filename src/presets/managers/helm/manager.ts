import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.HELM, Managers.HELM_VALUES],
  postUpdateOptions: ['helmUpdateSubChartArchives'],
  extends: createScopes(Preset.HELM_GROUP_MINOR, Preset.HELM_GROUP_MAJOR),
  packageRules: [
    {
      matchManagers: [Managers.HELM, Managers.HELM_VALUES],
      addLabels: ['helm']
    }
  ]
})
