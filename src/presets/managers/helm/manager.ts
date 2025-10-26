import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.HELM, Managers.HELM_VALUES],
  extends: createScopes(Preset.HELM_GROUP_MINOR, Preset.HELM_GROUP_MAJOR)
})
