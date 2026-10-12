import type { RenovateConfig } from 'renovate/dist/config/types.js'

import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from './custom-manager.js'
import { Labels } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

const MANAGER_FILE_PATTERNS = ['/\\.gitlab-ci\\.ya?ml$/', '/\\.gitlab-ci\\..*\\.ya?ml$/']

// Per-manager config blocks are keyed by manager name and are valid at runtime, but renovate does not
// surface that shape on the public `RenovateConfig` type — hence the cast.
export default createPreset({
  enabledManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI, Managers.REGEX],
  extends: [...createScopes(Preset.MANAGER_GITLAB_CI_CUSTOM, Preset.GROUP_GITLAB_CI_MINOR_UPDATES)],
  [Managers.GITLAB_CI]: { managerFilePatterns: MANAGER_FILE_PATTERNS },
  [Managers.GITLAB_CI_INCLUDE]: { managerFilePatterns: MANAGER_FILE_PATTERNS },
  packageRules: [
    {
      matchManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_GITLAB_CI, Labels.AREA_PIPELINES]
    },
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_GITLAB_CI, Labels.AREA_PIPELINES]
    }
  ]
} as RenovateConfig)
