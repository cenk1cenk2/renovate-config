import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      labels: [ 'automerge' ],
      schedule: [ SCHEDULE.DAILY ],
      automerge: true
    }
  ]
})
