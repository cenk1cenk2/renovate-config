import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from './custom-manager.js'
import { GITLAB_CI_MINOR_UPDATES } from './groups.js'
import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      ...GITLAB_CI_MINOR_UPDATES,
      labels: ['renovate', 'minor', 'automerge', 'pipelines'],
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
      labels: ['renovate', 'minor', 'automerge', 'pipelines'],
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
