import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    labels: [ 'renovate', 'lock' ],
    schedule: [ SCHEDULE.DAILY ]
  }
})
