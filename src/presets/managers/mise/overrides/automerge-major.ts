import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per tool whose major version is safe to take unattended. replacement updates stay banned
// outright by policy.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'mise all major automerge dependency updates',
      groupSlug: Groups.MISE_MAJOR_AUTOMERGE,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.MISE]
    }
  ]
})
