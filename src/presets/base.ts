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
  assignees: [
    'cenk1cenk2cenk3@gmail.com'
  ],
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
