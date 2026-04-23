import { Labels, SCHEDULE } from '@constants'
import { Managers } from '@managers'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.HELM, Managers.HELM_VALUES],
  postUpdateOptions: ['helmUpdateSubChartArchives'],
  extends: createScopes(Preset.GROUP_HELM_MINOR, Preset.GROUP_HELM_MAJOR),
  schedule: [SCHEDULE.ANY],
  packageRules: [
    {
      matchManagers: [Managers.HELM, Managers.HELM_VALUES],
      addLabels: [Labels.HELM]
    }
  ]
})
