import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.KUBERNETES],
  extends: createScopes(Preset.KUBERNETES_FILE_PATTERNS)
})
