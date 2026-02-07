import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure'],
      additionalBranchPrefix: 'terraform-',
      automerge: false,
      extends: [':semanticCommitTypeAll(fix)'],
      matchDepTypes: ['provider'],
      matchManagers: [Managers.TERRAFORM],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure'],
      additionalBranchPrefix: 'terraform-',
      automerge: false,
      extends: [':semanticCommitTypeAll(fix)'],
      matchDepTypes: ['required_provider'],
      matchManagers: [Managers.TERRAFORM],
      schedule: [SCHEDULE.ANY]
    },
    {
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['required_provider'],
      rangeStrategy: 'replace'
    }
  ]
})
