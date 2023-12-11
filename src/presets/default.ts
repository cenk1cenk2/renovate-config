import { createPreset, createScope } from '@lib'
import { Preset } from '@presets'

import { Managers } from '@constants'

export default createPreset({
  enabledManagers: Object.values(Managers),
  extends: [ createScope(Preset.BASE), createScope(Preset.LOCK_FILE), createScope(Preset.NO_TESTS), createScope(Preset.NODE), createScope(Preset.GO) ]
})
