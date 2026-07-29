import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '@constants'
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
      depTypes: ['module']
    }),
    // In-house modules are resolved through the custom manager below, not the terraform manager.
    {
      enabled: false,
      matchDepTypes: ['module'],
      matchManagers: [Managers.TERRAFORM],
      matchSourceUrls: ['https://gitlab.kilic.dev/**']
    },
    createMultiDirectoryGroupRule({
      name: 'terraform-monorepo',
      updateType: 'minor',
      slug: Groups.TERRAFORM_MONOREPO_MINOR,
      managers: [Managers.REGEX],
      depTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      sourceUrls: ['https://gitlab.kilic.dev/**']
    })
  ]
})
