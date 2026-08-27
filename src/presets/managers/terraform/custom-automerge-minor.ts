import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from './custom-manager.js'
import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per in-house module, argument passed by the consuming repository. custom.regex is shared with
// the gitlab-ci custom manager, so the dep type is what keeps this off gitlab-ci's dependencies.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform-monorepo',
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.TERRAFORM_MONOREPO_MINOR_AUTOMERGE,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
