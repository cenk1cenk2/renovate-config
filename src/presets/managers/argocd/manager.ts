import { Labels, SCHEDULE } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.ARGOCD],
  extends: createScopes(Preset.GROUP_ARGOCD_MINOR, Preset.GROUP_ARGOCD_MAJOR),
  packageRules: [
    {
      matchManagers: [Managers.ARGOCD],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_ARGOCD, Labels.AREA_INFRASTRUCTURE],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
