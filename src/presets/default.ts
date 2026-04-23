import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: Object.values(Managers),
  extends: createScopes(
    Preset.BASE,
    Preset.LOCK_FILE,
    Preset.NO_TESTS,
    // managers
    Preset.MANAGER_ANSIBLE_GALAXY,
    Preset.MANAGER_ARGOCD,
    Preset.MANAGER_DOCKERFILE,
    Preset.MANAGER_GITLAB_CI,
    Preset.MANAGER_GO,
    Preset.MANAGER_HELM,
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
