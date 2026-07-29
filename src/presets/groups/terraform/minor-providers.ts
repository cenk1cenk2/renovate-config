import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform',
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.TERRAFORM_MINOR,
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['provider', 'required_provider']
    }),
    {
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['required_provider'],
      rangeStrategy: 'replace'
    }
  ]
})
