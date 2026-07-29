import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform',
      updateType: 'minor',
      slug: Groups.TERRAFORM_MINOR,
      managers: [Managers.TERRAFORM],
      depTypes: ['provider', 'required_provider']
    }),
    {
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['required_provider'],
      rangeStrategy: 'replace'
    }
  ]
})
