import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  lockFileMaintenance: {
    enabled: true,
    automerge: true,
    commitBody: '[skip ci]',
    ignoreTests: true,
    addLabels: [Labels.DEP_LOCK, Labels.AUTOMERGE],
    schedule: [SCHEDULE.DAILY]
  }
})
