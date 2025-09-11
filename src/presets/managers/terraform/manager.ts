import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.TERRAFORM, Managers.REGEX],
  extends: createScopes(Preset.TERRAFORM_CUSTOM_MANAGER, Preset.TERRAFORM_MINOR_HELM_RELEASES, Preset.TERRAFORM_GROUP_MINOR_PROVIDERS, Preset.TERRAFORM_GROUP_MINOR_PROVIDERS)
})
