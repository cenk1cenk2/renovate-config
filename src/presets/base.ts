import { ASSIGNEES, Labels, TIMEZONE } from '@constants'
import { createBasePreset } from '@lib'

export default createBasePreset({
  extends: ['config:recommended', ':configMigration', ':dependencyDashboard', ':disableRateLimiting', ':updateNotScheduled', ':enableVulnerabilityAlerts'],
  timezone: TIMEZONE,
  semanticCommits: 'enabled',
  // assignees: ASSIGNEES,
  reviewers: ASSIGNEES,
  labels: [Labels.RENOVATE],
  prCreation: 'immediate',
  packageRules: [
    // The update axis is assigned once here so no downstream rule has to restate it. `rollback` is left
    // uncovered on purpose: `rollbackPrs` defaults to false and this config never enables it.
    {
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest', 'pinDigest', 'bump'],
      addLabels: [Labels.UPDATE_MINOR]
    },
    {
      matchUpdateTypes: ['major', 'replacement'],
      addLabels: [Labels.UPDATE_MAJOR]
    }
  ]
})
