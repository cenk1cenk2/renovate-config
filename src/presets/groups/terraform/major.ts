import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'
import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '@presets/managers/terraform/custom-manager.js'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.TERRAFORM_MAJOR,
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module']
    }),
    createMultiDirectoryGroupRule({
      name: 'terraform-monorepo',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.TERRAFORM_MONOREPO_MAJOR,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      matchSourceUrls: ['https://gitlab.kilic.dev/**']
    })
  ]
})
