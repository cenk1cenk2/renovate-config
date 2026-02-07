import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from './custom-manager.js'
import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI, Managers.REGEX],
  extends: [...createScopes(Preset.GITLAB_CI_CUSTOM_MANAGER, Preset.GITLAB_CI_MINOR_UPDATES)],
  packageRules: [
    {
      matchManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI],
      addLabels: ['gitlab-ci']
    },
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO],
      addLabels: ['gitlab-ci']
    }
  ]
})
