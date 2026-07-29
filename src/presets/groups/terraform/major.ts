import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform',
      updateType: 'major',
      slug: Groups.TERRAFORM_MAJOR,
      managers: [Managers.TERRAFORM],
      depTypes: ['helm_release', 'provider', 'required_provider', 'module']
    }),
    createMultiDirectoryGroupRule({
      name: 'terraform-monorepo',
      updateType: 'major',
      slug: Groups.TERRAFORM_MONOREPO_MAJOR,
      managers: [Managers.REGEX],
      depTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      sourceUrls: ['https://gitlab.kilic.dev/**']
    })
  ]
})
