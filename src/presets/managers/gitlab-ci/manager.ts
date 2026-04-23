import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from './custom-manager.js'
import { Labels } from '@constants'
import { Managers } from '@managers'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI, Managers.REGEX],
  extends: [...createScopes(Preset.MANAGER_GITLAB_CI_CUSTOM, Preset.GROUP_GITLAB_CI_MINOR_UPDATES)],
  packageRules: [
    {
      matchManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI],
      addLabels: [Labels.GITLAB_CI]
    },
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO],
      addLabels: [Labels.GITLAB_CI]
    }
  ]
})
