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
  // TODO: this is because of a breaking change in renovate v42.x
  minimumReleaseAgeBehaviour: 'timestamp-optional',
  prCreation: 'immediate'
})
