import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.KUSTOMIZE],
  extends: createScopes(Preset.KUSTOMIZE_MINOR_HELM_RELEASES)
})
