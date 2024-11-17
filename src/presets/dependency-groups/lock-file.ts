import { SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    commitMessageSuffix: '[skip ci]',
    labels: ['renovate', 'lock'],
    schedule: [SCHEDULE.DAILY]
  }
})
