import { Labels } from '@constants'
import { Managers } from '@managers'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '@presets/managers/terraform/custom-manager.js'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: [Labels.RENOVATE, Labels.MAJOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'terraform all major dependency updates',
      groupSlug: Groups.TERRAFORM_MAJOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module'],
      matchManagers: [Managers.TERRAFORM]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: [Labels.RENOVATE, Labels.MAJOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'terraform-monorepo all major dependency updates',
      groupSlug: Groups.TERRAFORM_MONOREPO_MAJOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      matchManagers: [Managers.REGEX],
      matchSourceUrls: ['https://gitlab.kilic.dev/**']
    }
  ]
})
