import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from './custom-manager.js'
import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per in-house module whose major version is safe to take unattended. The dep type keeps this off
// the gitlab-ci custom manager, which shares custom.regex.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform-monorepo',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.TERRAFORM_MONOREPO_MAJOR_AUTOMERGE,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
