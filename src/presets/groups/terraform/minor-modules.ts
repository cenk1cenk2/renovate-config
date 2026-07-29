import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'
import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '@presets/managers/terraform/custom-manager.js'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform',
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.TERRAFORM_MINOR,
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['module']
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
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.TERRAFORM_MONOREPO_MINOR,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      matchSourceUrls: ['https://gitlab.kilic.dev/**']
    })
  ]
})
