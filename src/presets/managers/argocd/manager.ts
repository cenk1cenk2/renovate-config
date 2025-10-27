import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.ARGOCD],
  extends: createScopes(Preset.ARGOCD_GROUP_MINOR, Preset.ARGOCD_GROUP_MAJOR)
})
