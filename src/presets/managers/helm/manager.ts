import { Labels, SCHEDULE } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.HELM, Managers.HELM_VALUES],
  postUpdateOptions: ['helmUpdateSubChartArchives'],
  extends: createScopes(Preset.GROUP_HELM_MINOR, Preset.GROUP_HELM_MAJOR),
  packageRules: [
    {
      matchManagers: [Managers.HELM, Managers.HELM_VALUES],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_HELM, Labels.AREA_INFRASTRUCTURE],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
