import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    commitMessageSuffix: '[skip ci]',
    labels: [Labels.RENOVATE, Labels.LOCK],
    schedule: [SCHEDULE.DAILY]
  }
})
