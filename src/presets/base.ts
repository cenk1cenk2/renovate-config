import { ASSIGNEES, TIMEZONE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  extends: ['config:recommended', ':configMigration', ':dependencyDashboard', ':masterIssue', ':disableRateLimiting', ':updateNotScheduled', ':enableVulnerabilityAlerts'],
  timezone: TIMEZONE,
  semanticCommits: 'enabled',
  assignees: ASSIGNEES,
  labels: ['renovate'],
  major: {
    stabilityDays: 3
  },
  prCreation: 'immediate'
})
