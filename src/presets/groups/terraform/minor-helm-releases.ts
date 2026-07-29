import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform',
      updateType: 'minor',
      groupSlug: Groups.TERRAFORM_MINOR,
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['helm_release']
    })
  ]
})
