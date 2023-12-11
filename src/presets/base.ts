import { createPreset } from '@lib'

import { ASSIGNEES, TIMEZONE } from '@constants'

export default createPreset({
  extends: [ 'config:base', ':masterIssue', ':prHourlyLimitNone', ':prConcurrentLimitNone' ],
  timezone: TIMEZONE,
  semanticCommits: 'enabled',
  assignees: ASSIGNEES,
  labels: [ 'renovate' ],
  rangeStrategy: 'bump',
  major: {
    stabilityDays: 3
  },
  prCreation: 'immediate'
})
