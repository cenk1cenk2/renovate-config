import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per module, provider or release, argument passed by the consuming repository. The central minor
// groups split by dep type; the argument already bounds the rule, so this one covers all four at once.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform',
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.TERRAFORM_MINOR_AUTOMERGE,
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module'],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
