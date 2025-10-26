import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from './custom-manager.js'
import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure'],
      additionalBranchPrefix: 'terraform-module-',
      automerge: false,
      extends: [':semanticCommitTypeAll(fix)'],
      matchDepTypes: ['module'],
      matchManagers: [Managers.TERRAFORM],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: false,
      matchDepTypes: ['module'],
      matchManagers: [Managers.TERRAFORM],
      registryUrls: ['gitlab.kilic.dev']
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure'],
      groupName: 'terraform-monorepo all minor dependency updates',
      groupSlug: 'terraform-monorepo',
      automerge: false,
      registryUrls: ['gitlab.kilic.dev'],
      extends: [':semanticCommitTypeAll(feat)'],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      matchManagers: [Managers.REGEX],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
