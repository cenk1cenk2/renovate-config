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
      matchDepTypes: ['provider'],
      matchManagers: [Managers.TERRAFORM],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      rangeStrategy: 'replace',
      labels: ['renovate', 'minor'],
      automerge: false,
      extends: [':semanticCommitTypeAll(fix)'],
      matchDepTypes: ['required_provider'],
      matchManagers: [Managers.TERRAFORM],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
