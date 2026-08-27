import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per module, provider or release whose major version is safe to take unattended. replacement
// updates stay banned outright by policy.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'terraform',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.TERRAFORM_MAJOR_AUTOMERGE,
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module'],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
