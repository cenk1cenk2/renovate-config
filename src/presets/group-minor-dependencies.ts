import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '*' ],
      depTypeList: [ 'dependencies' ],
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      groupName: 'all minor dependency updates',
      groupSlug: 'all',
      rangeStrategy: 'bump',
      labels: [ 'renovate', 'minor', 'automerge' ],
      automerge: true,
      schedule: [ SCHEDULE.TWICE_A_DAY ]
    }
  ]
})
