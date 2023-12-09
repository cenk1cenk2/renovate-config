import { createPreset } from '@lib'

import { SCHEDULE } from '@constants'

export default createPreset({
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    commitMessageSuffix: '[skip ci]',
    labels: [ 'renovate', 'lock' ],
    schedule: [ SCHEDULE.DAILY ]
  }
})
