import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from './custom-manager.js'
import { Labels, SCHEDULE } from '@constants'
import { Managers } from '@managers'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.TERRAFORM, Managers.REGEX],
  extends: createScopes(
    Preset.MANAGER_TERRAFORM_CUSTOM,
    Preset.GROUP_TERRAFORM_MINOR_HELM_RELEASES,
    Preset.GROUP_TERRAFORM_MINOR_PROVIDERS,
    Preset.GROUP_TERRAFORM_MINOR_MODULES,
    Preset.GROUP_TERRAFORM_MAJOR
  ),
  schedule: [SCHEDULE.ANY],
  packageRules: [
    {
      matchManagers: [Managers.TERRAFORM],
      addLabels: [Labels.TERRAFORM]
    },
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      addLabels: [Labels.TERRAFORM]
    }
  ]
})
