import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from './custom-manager.js'
import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      rangeStrategy: 'auto',
      labels: ['renovate', 'major', 'infrastructure'],
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module'],
      matchManagers: [Managers.TERRAFORM],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      rangeStrategy: 'auto',
      labels: ['renovate', 'major', 'infrastructure'],
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      registryUrls: ['gitlab.kilic.dev'],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      matchManagers: [Managers.REGEX],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
