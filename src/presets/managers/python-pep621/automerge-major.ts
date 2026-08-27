import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per package whose major version is safe to take unattended. replacement updates stay banned
// outright by policy.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'python all major automerge dependency updates',
      groupSlug: Groups.PYTHON_MAJOR_AUTOMERGE,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.PYTHON_PEP621]
    }
  ]
})
