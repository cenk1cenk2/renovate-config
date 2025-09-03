import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.KUBERNETES],
  extends: createScopes(Preset.GO_GROUP_MINOR_DEPENDENCIES)
})
