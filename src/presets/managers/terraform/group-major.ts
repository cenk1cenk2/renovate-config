import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from './custom-manager.js'
import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure'],
      additionalBranchPrefix: 'terraform-',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module'],
      matchManagers: [Managers.TERRAFORM],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure'],
      additionalBranchPrefix: 'terraform-monorepo-',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      matchManagers: [Managers.REGEX],
      schedule: [SCHEDULE.ANY],
      matchSourceUrls: ['https://gitlab.kilic.dev/**']
    }
  ]
})
