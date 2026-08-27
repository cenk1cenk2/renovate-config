import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per crate whose major version is safe to take unattended. replacement updates stay banned
// outright by policy.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'rust all major automerge dependency updates',
      groupSlug: Groups.RUST_MAJOR_AUTOMERGE,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.RUST_CARGO]
    }
  ]
})
