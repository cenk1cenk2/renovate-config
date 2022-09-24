import { createPreset } from '@lib/preset-factory'

import { TIMEZONE } from '@constants/constants'
import { Managers } from '@constants/managers'
import { ASSIGNEES } from '@constants/users'

export default createPreset({
  enabledManagers: Object.values(Managers),
  extends: [ 'config:base', ':masterIssue', ':prHourlyLimitNone', ':prConcurrentLimitNone' ],
  timezone: TIMEZONE,
  semanticCommits: 'enabled',
  assignees: ASSIGNEES,
  labels: [ 'renovate' ],
  rangeStrategy: 'bump',
  major: {
    stabilityDays: 3
  },
  prCreation: 'immediate',
  postUpdateOptions: [ 'gomodTidy', 'gomodUpdateImportPaths' ]
})
