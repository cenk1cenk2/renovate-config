import { GITLAB_CI_MINOR_UPDATES } from './groups.js'
import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO, Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    {
      ...GITLAB_CI_MINOR_UPDATES,
      addLabels: [Labels.AUTOMERGE],
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
      addLabels: [Labels.AUTOMERGE],
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
