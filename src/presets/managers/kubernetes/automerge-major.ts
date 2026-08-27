import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per image whose major version is safe to take unattended. replacement updates stay banned
// outright by policy.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'kubernetes all major automerge dependency updates',
      groupSlug: Groups.KUBERNETES_MAJOR_AUTOMERGE,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.KUBERNETES]
    }
  ]
})
