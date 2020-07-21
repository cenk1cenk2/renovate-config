import { TIMEZONE } from '@constants/constants'
import { SCHEDULE } from '@constants/renovate'
import { assignees } from '@constants/users'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  extends: [ 'config:base', ':masterIssue' ],
  ignorePresets: [ ':prHourlyLimit2' ],
  timezone: TIMEZONE,
  semanticCommits: true,
  semanticCommitType: 'fix',
  rangeStrategy: 'update-lockfile',
  assignees,
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    schedule: [ SCHEDULE.WEEKLY ]
  },
  major: {
    stabilityDays: 3
  },
  schedule: [ SCHEDULE.DAILY ],
  prCreation: 'not-pending'
})
