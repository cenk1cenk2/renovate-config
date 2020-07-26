import { TIMEZONE } from '@constants/constants'
import { ASSIGNEES } from '@constants/users'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  extends: [ 'config:base', ':masterIssue', ':prHourlyLimitNone', ':prConcurrentLimitNone' ],
  timezone: TIMEZONE,
  semanticCommits: true,
  assignees: ASSIGNEES,
  labels: [ 'renovate' ],
  rangeStrategy: 'bump',
  major: {
    stabilityDays: 3
  },
  prCreation: 'immediate'
})
