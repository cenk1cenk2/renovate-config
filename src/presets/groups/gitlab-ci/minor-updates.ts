import { GITLAB_CI_MINOR_UPDATES } from './groups.js'
import { Labels, SCHEDULE } from '@constants'
import { Managers } from '@managers'
import { createPreset } from '@lib'
import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from '@presets/managers/gitlab-ci/custom-manager.js'

export default createPreset({
  packageRules: [
    {
      ...GITLAB_CI_MINOR_UPDATES,
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.AUTOMERGE, Labels.PIPELINES],
      automerge: true,
      matchManagers: [Managers.GITLAB_CI_INCLUDE],
      schedule: [SCHEDULE.ANY],
      extends: [':semanticCommitTypeAll(ci)']
    },
    {
      matchManagers: [Managers.GITLAB_CI_INCLUDE],
      rangeStrategy: 'bump'
    },
    {
      ...GITLAB_CI_MINOR_UPDATES,
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.AUTOMERGE, Labels.PIPELINES],
      automerge: true,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO],
      schedule: [SCHEDULE.ANY],
      extends: [':semanticCommitTypeAll(ci)']
    },
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO],
      rangeStrategy: 'bump'
    }
  ]
})
