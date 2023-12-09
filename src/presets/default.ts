import { createPreset, createScope } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  extends: [
    createScope(Preset.BASE),
    createScope(Preset.LOCK_FILE),
    createScope(Preset.NO_TESTS),
    createScope(Preset.GROUP_MINOR_DEPENDENCIES),
    createScope(Preset.GROUP_DEV_DEPENDENCIES),
    createScope(Preset.GROUP_PEER_DEPENDENCIES),
    createScope(Preset.BRANCH_DEVELOP),
    createScope(Preset.BRANCH_BETA)
  ]
})
