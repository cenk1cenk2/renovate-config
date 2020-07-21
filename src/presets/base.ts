import { TIMEZONE } from '@constants/constants'
import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  extends: [ 'config:base', ':masterIssue' ],
  ignorePresets: [ ':prHourlyLimit2' ],
  timezone: TIMEZONE,
  semanticCommits: true,
  semanticCommitType: 'fix',
  rangeStrategy: 'update-lockfile',
  lockFileMaintenance: {
    enabled: true,
    schedule: [ SCHEDULE.EVERY_MONDAY ]
  },
  major: {
    stabilityDays: 3
  },
  schedule: [ SCHEDULE.ANY ],
  prCreation: 'not-pending'
})
