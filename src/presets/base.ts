import { ASSIGNEES, Labels, TIMEZONE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  extends: ['config:recommended', ':configMigration', ':dependencyDashboard', ':disableRateLimiting', ':updateNotScheduled', ':enableVulnerabilityAlerts'],
  timezone: TIMEZONE,
  semanticCommits: 'enabled',
  // assignees: ASSIGNEES,
  reviewers: ASSIGNEES,
  labels: [Labels.RENOVATE],
  prCreation: 'immediate'
})
