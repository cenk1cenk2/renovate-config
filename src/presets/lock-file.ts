import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    commitMessageSuffix: '[skip ci]',
    addLabels: [Labels.DEP_LOCK, Labels.AUTOMERGE],
    schedule: [SCHEDULE.DAILY]
  }
})
