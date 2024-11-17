import { ASSIGNEES, TIMEZONE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  extends: ['config:base', ':masterIssue', ':prHourlyLimitNone', ':prConcurrentLimitNone'],
  timezone: TIMEZONE,
  semanticCommits: 'enabled',
  assignees: ASSIGNEES,
  labels: ['renovate'],
  rangeStrategy: 'bump',
  major: {
    stabilityDays: 3
  },
  prCreation: 'immediate'
})
