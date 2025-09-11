import { DEP_TYPE_GITLAB_CI_CUSTOM_MANAGER_PIPELINES } from './custom-manager.js'
import { GITLAB_CI_MINOR_UPDATES } from './groups.js'
import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      ...GITLAB_CI_MINOR_UPDATES,
      rangeStrategy: 'bump',
      labels: ['renovate', 'minor', 'automerge', 'pipelines'],
      automerge: true,
      matchManagers: [Managers.GITLAB_CI_INCLUDE],
      schedule: [SCHEDULE.ANY]
    },
    {
      ...GITLAB_CI_MINOR_UPDATES,
      rangeStrategy: 'bump',
      labels: ['renovate', 'minor', 'automerge', 'pipelines'],
      automerge: true,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_CUSTOM_MANAGER_PIPELINES],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
