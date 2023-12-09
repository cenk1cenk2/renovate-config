import { createPreset } from '@lib'

import { TIMEZONE, Managers, ASSIGNEES } from '@constants'

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
