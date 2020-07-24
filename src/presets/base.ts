import { TIMEZONE } from '@constants/constants'
import { ASSIGNEES } from '@constants/users'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  extends: [ 'config:base', ':masterIssue', ':prHourlyLimitNone' ],
  timezone: TIMEZONE,
  semanticCommits: true,
  rangeStrategy: 'update-lockfile',
  assignees: ASSIGNEES,
  labels: [ 'renovate' ],
  major: {
    stabilityDays: 3
  },
  prCreation: 'immediate'
})
