import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

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
      matchDepTypes: ['provider'],
      matchManagers: [Managers.TERRAFORM]
    },
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
      matchDepTypes: ['required_provider'],
      matchManagers: [Managers.TERRAFORM]
    },
    {
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['required_provider'],
      rangeStrategy: 'replace'
    }
  ]
})
