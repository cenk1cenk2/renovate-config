import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      rangeStrategy: 'auto',
      labels: ['renovate', 'minor'],
      automerge: false,
      extends: [':semanticCommitTypeAll(fix)'],
      matchDepTypes: ['module'],
      matchManagers: [Managers.TERRAFORM],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
