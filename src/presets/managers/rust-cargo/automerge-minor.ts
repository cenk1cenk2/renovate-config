import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per crate, argument passed by the consuming repository. No `digest` update type: cargo resolves
// versions from crates.io, which has no digest to pin.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'rust all minor automerge dependency updates',
      groupSlug: Groups.RUST_MINOR_AUTOMERGE,
      matchUpdateTypes: ['minor', 'patch', 'pin'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.RUST_CARGO]
    }
  ]
})
