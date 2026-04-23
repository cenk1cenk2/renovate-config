import { Labels } from '@constants'
import { Managers } from '@managers'
import { Groups } from '@groups'
import { createPreset } from '@lib'

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
      matchDepTypes: ['helm_release'],
      matchManagers: [Managers.TERRAFORM]
    }
  ]
})
