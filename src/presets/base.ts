import { TIMEZONE } from '@constants/constants'
import { SCHEDULE } from '@constants/renovate'
import { assignees } from '@constants/users'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  extends: [ 'config:base', ':masterIssue' ],
  ignorePresets: [ ':prHourlyLimit2' ],
  timezone: TIMEZONE,
  semanticCommits: true,
  rangeStrategy: 'update-lockfile',
  assignees,
  labels: [ 'deps' ],
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    schedule: [ SCHEDULE.WEEKLY ]
  },
  major: {
    stabilityDays: 3
  },
  schedule: [ SCHEDULE.DAILY ],
  prCreation: 'immediate'
})
