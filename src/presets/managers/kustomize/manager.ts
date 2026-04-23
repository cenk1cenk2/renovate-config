import { Labels, SCHEDULE } from '@constants'
import { Managers } from '@managers'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.KUSTOMIZE],
  extends: createScopes(Preset.GROUP_KUSTOMIZE_MINOR_HELM_RELEASES, Preset.GROUP_KUSTOMIZE_MAJOR),
  schedule: [SCHEDULE.ANY],
  packageRules: [
    {
      matchManagers: [Managers.KUSTOMIZE],
      addLabels: [Labels.KUSTOMIZE]
    }
  ]
})
