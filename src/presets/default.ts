import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: Object.values(Managers),
  // `config:recommended`, reached through `base`, extends `:ignoreModulesAndTests`, which skips every
  // `test`, `tests` and `__tests__` directory. `ignorePresets` only filters the presets below the one that
  // declares it, so it has to sit above `base`; a preset extended beside this one would filter nothing.
  ignorePresets: [':ignoreModulesAndTests'],
  extends: createScopes(
    Preset.BASE,
    Preset.LOCK_FILE,
    // managers
    Preset.MANAGER_ANSIBLE_GALAXY,
    Preset.MANAGER_ARGOCD,
    Preset.MANAGER_DOCKERFILE,
    Preset.MANAGER_GITLAB_CI,
    Preset.MANAGER_GO,
    Preset.MANAGER_HELM,
    Preset.MANAGER_HK,
    Preset.MANAGER_KUBERNETES,
    Preset.MANAGER_KUSTOMIZE,
    Preset.MANAGER_NODE,
    Preset.MANAGER_OTEL_BUILDER,
    Preset.MANAGER_PYTHON,
    Preset.MANAGER_RUST,
    Preset.MANAGER_TERRAFORM,

    Preset.DATASOURCE_DOCKER
  )
})
