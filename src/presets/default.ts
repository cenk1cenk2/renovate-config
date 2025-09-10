import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: Object.values(Managers),
  extends: createScopes(
    Preset.BASE,
    Preset.LOCK_FILE,
    Preset.NO_TESTS,
    // managers
    Preset.ANSIBLE_GALAXY,
    Preset.DOCKERFILE,
    Preset.GITLAB_CI,
    Preset.GO,
    Preset.HELM,
    Preset.KUSTOMIZE,
    Preset.NODE,
    Preset.PYTHON,
    Preset.RUST,
    Preset.TERRAFORM,
    Preset.CUSTOM_MANAGERS
  )
})
