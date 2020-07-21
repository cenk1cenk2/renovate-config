import { TIMEZONE } from '@constants/constants'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  extends: [ 'config:base', ':masterIssue' ],
  ignorePresets: [ ':prHourlyLimit2' ],
  timezone: TIMEZONE,
  semanticCommits: true,
  semanticCommitType: 'fix',
  lockFileMaintenance: {
    enabled: true
  },
  major: {
    stabilityDays: 3
  },
  prCreation: 'not-pending'
})
