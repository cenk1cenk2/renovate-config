import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from './custom-manager.js'
import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.TERRAFORM, Managers.REGEX],
  extends: createScopes(
    Preset.TERRAFORM_CUSTOM_MANAGER,
    Preset.TERRAFORM_MINOR_HELM_RELEASES,
    Preset.TERRAFORM_GROUP_MINOR_PROVIDERS,
    Preset.TERRAFORM_GROUP_MINOR_MODULES,
    Preset.TERRAFORM_GROUP_MAJOR
  ),
  packageRules: [
    {
      matchManagers: [Managers.TERRAFORM],
      addLabels: ['terraform']
    },
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      addLabels: ['terraform']
    }
  ]
})
