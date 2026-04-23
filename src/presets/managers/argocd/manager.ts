import { Labels, SCHEDULE } from '@constants'
import { Managers } from '@managers'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.ARGOCD],
  extends: createScopes(Preset.GROUP_ARGOCD_MINOR, Preset.GROUP_ARGOCD_MAJOR),
  schedule: [SCHEDULE.ANY],
  packageRules: [
    {
      matchManagers: [Managers.ARGOCD],
      addLabels: [Labels.ARGOCD]
    }
  ]
})
