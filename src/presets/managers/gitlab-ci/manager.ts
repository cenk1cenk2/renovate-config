import { Managers } from '@constants'
import { createPreset } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI],
  extends: [Preset.GITLAB_CI_INCLUDES_MINOR_UPDATES]
})
