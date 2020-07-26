import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    commitMessageSuffix: '[skip ci]',
    labels: [ 'renovate', 'lock' ],
    schedule: [ SCHEDULE.TWICE_A_DAY ]
  }
})
