import { createPreset } from '@lib/preset-factory'

import { SCHEDULE } from '@constants/renovate'

export default createPreset({
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    commitMessageSuffix: '[skip ci]',
    labels: [ 'renovate', 'lock' ],
    schedule: [ SCHEDULE.DAILY ]
  }
})
