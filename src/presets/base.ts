import { ASSIGNEES, TIMEZONE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  extends: ['config:recommended', ':configMigration', ':dependencyDashboard', ':disableRateLimiting', ':updateNotScheduled', ':enableVulnerabilityAlerts'],
  timezone: TIMEZONE,
  semanticCommits: 'enabled',
  assignees: ASSIGNEES,
  labels: ['renovate'],
  major: {
    minimumReleaseAge: '3 days'
  },
  prCreation: 'immediate'
})
