import { Labels } from '@constants'
import { Managers } from '@managers'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '@presets/managers/terraform/custom-manager.js'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'terraform all minor dependency updates',
      groupSlug: Groups.TERRAFORM_MINOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchDepTypes: ['module'],
      matchManagers: [Managers.TERRAFORM]
    },
    {
      enabled: false,
      matchDepTypes: ['module'],
      matchManagers: [Managers.TERRAFORM],
      matchSourceUrls: ['https://gitlab.kilic.dev/**']
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'terraform-monorepo all minor dependency updates',
      groupSlug: Groups.TERRAFORM_MONOREPO_MINOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      matchManagers: [Managers.REGEX],
      matchSourceUrls: ['https://gitlab.kilic.dev/**']
    }
  ]
})
